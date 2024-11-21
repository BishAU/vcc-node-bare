import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DesignProject, DesignPrompt, DesignGeneration } from '../types/design';

interface DesignState {
    projects: DesignProject[];
    activeProject: DesignProject | null;
    generations: Record<string, DesignGeneration>;
    isLoading: boolean;
    error: string | null;
    createProject: (name: string, prompt: DesignPrompt) => Promise<DesignProject>;
    updateProject: (projectId: string, updates: Partial<DesignProject>) => void;
    deleteProject: (projectId: string) => void;
    setActiveProject: (project: DesignProject | null) => void;
    generateDesign: (projectId: string) => Promise<void>;
    getProjectStatus: (projectId: string) => DesignGeneration | null;
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useDesignStore = create<DesignState>()(
    persist(
        (set, get) => ({
            projects: [],
            activeProject: null,
            generations: {},
            isLoading: false,
            error: null,

            createProject: async (name: string, prompt: DesignPrompt) => {
                const project: DesignProject = {
                    id: crypto.randomUUID(),
                    name,
                    prompt,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId: 'current-user', // TODO: Get from auth store
                };

                set(state => ({
                    projects: [...state.projects, project],
                }));

                return project;
            },

            updateProject: (projectId: string, updates: Partial<DesignProject>) => {
                set(state => ({
                    projects: state.projects.map(project =>
                        project.id === projectId
                            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
                            : project
                    ),
                }));
            },

            deleteProject: (projectId: string) => {
                set(state => ({
                    projects: state.projects.filter(project => project.id !== projectId),
                    generations: Object.fromEntries(
                        Object.entries(state.generations).filter(([id]) => id !== projectId)
                    ),
                }));
            },

            setActiveProject: (project: DesignProject | null) => {
                set({ activeProject: project });
            },

            generateDesign: async (projectId: string) => {
                const project = get().projects.find(p => p.id === projectId);
                if (!project) throw new Error('Project not found');

                set(state => ({
                    generations: {
                        ...state.generations,
                        [projectId]: {
                            projectId,
                            status: 'queued',
                            progress: 0,
                        },
                    },
                }));

                // Simulate design generation process
                try {
                    // Update to processing
                    set(state => ({
                        generations: {
                            ...state.generations,
                            [projectId]: {
                                ...state.generations[projectId],
                                status: 'processing',
                                progress: 0,
                            },
                        },
                    }));

                    // Simulate progress updates
                    for (let i = 0; i <= 100; i += 20) {
                        await delay(1000);
                        set(state => ({
                            generations: {
                                ...state.generations,
                                [projectId]: {
                                    ...state.generations[projectId],
                                    progress: i,
                                },
                            },
                        }));
                    }

                    // Simulate completion with mock URLs
                    set(state => ({
                        generations: {
                            ...state.generations,
                            [projectId]: {
                                ...state.generations[projectId],
                                status: 'completed',
                                progress: 100,
                                result: {
                                    imageUrl: 'https://placeholder.co/800x600',
                                    previewUrl: 'https://placeholder.co/400x300',
                                },
                            },
                        },
                    }));

                    // Update project status
                    get().updateProject(projectId, {
                        status: 'completed',
                        imageUrl: 'https://placeholder.co/800x600',
                        previewUrl: 'https://placeholder.co/400x300',
                    });

                } catch (error) {
                    set(state => ({
                        generations: {
                            ...state.generations,
                            [projectId]: {
                                ...state.generations[projectId],
                                status: 'failed',
                                error: error instanceof Error ? error.message : 'Unknown error',
                            },
                        },
                    }));

                    get().updateProject(projectId, { status: 'failed' });
                }
            },

            getProjectStatus: (projectId: string) => {
                return get().generations[projectId] || null;
            },
        }),
        {
            name: 'design-store',
        }
    )
);
