import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DesignVersion, DesignPrompt } from '../types/design';

interface DesignVersionState {
    versions: Record<string, DesignVersion[]>;
    currentVersions: Record<string, string>;
    createVersion: (projectId: string, prompt: DesignPrompt) => Promise<DesignVersion>;
    updateVersion: (projectId: string, versionId: string, updates: Partial<DesignVersion>) => void;
    setCurrentVersion: (projectId: string, versionId: string) => void;
    getVersionHistory: (projectId: string) => DesignVersion[];
    compareVersions: (versionId1: string, versionId2: string) => {
        added: string[];
        removed: string[];
        modified: string[];
    };
}

const useDesignVersionStore = create<DesignVersionState>()(
    persist(
        (set, get) => ({
            versions: {},
            currentVersions: {},

            createVersion: async (projectId: string, prompt: DesignPrompt) => {
                const version: DesignVersion = {
                    id: crypto.randomUUID(),
                    projectId,
                    prompt,
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                    metadata: {
                        aiModel: 'stable-diffusion-xl',
                        generationParams: {
                            steps: 50,
                            guidance_scale: 7.5,
                            seed: Math.floor(Math.random() * 1000000),
                        },
                    },
                };

                set(state => ({
                    versions: {
                        ...state.versions,
                        [projectId]: [...(state.versions[projectId] || []), version],
                    },
                    currentVersions: {
                        ...state.currentVersions,
                        [projectId]: version.id,
                    },
                }));

                return version;
            },

            updateVersion: (projectId: string, versionId: string, updates: Partial<DesignVersion>) => {
                set(state => ({
                    versions: {
                        ...state.versions,
                        [projectId]: state.versions[projectId]?.map(version =>
                            version.id === versionId
                                ? { ...version, ...updates }
                                : version
                        ) || [],
                    },
                }));
            },

            setCurrentVersion: (projectId: string, versionId: string) => {
                set(state => ({
                    currentVersions: {
                        ...state.currentVersions,
                        [projectId]: versionId,
                    },
                }));
            },

            getVersionHistory: (projectId: string) => {
                return get().versions[projectId] || [];
            },

            compareVersions: (versionId1: string, versionId2: string) => {
                const version1 = Object.values(get().versions)
                    .flat()
                    .find(v => v.id === versionId1);
                const version2 = Object.values(get().versions)
                    .flat()
                    .find(v => v.id === versionId2);

                if (!version1 || !version2) {
                    throw new Error('Version not found');
                }

                const prompt1 = JSON.stringify(version1.prompt);
                const prompt2 = JSON.stringify(version2.prompt);

                const changes = {
                    added: [] as string[],
                    removed: [] as string[],
                    modified: [] as string[],
                };

                // Compare prompts
                const props1 = Object.keys(version1.prompt);
                const props2 = Object.keys(version2.prompt);

                props1.forEach(prop => {
                    if (!props2.includes(prop)) {
                        changes.removed.push(prop);
                    } else if (
                        JSON.stringify(version1.prompt[prop as keyof DesignPrompt]) !==
                        JSON.stringify(version2.prompt[prop as keyof DesignPrompt])
                    ) {
                        changes.modified.push(prop);
                    }
                });

                props2.forEach(prop => {
                    if (!props1.includes(prop)) {
                        changes.added.push(prop);
                    }
                });

                return changes;
            },
        }),
        {
            name: 'design-versions',
        }
    )
);

export default useDesignVersionStore;
