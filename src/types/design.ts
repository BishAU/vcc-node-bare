export interface DesignPrompt {
    vehicleType: 'car' | 'motorcycle' | 'truck' | 'van';
    baseColor: string;
    style: 'modern' | 'vintage' | 'racing' | 'custom';
    description: string;
    additionalColors?: string[];
    reference?: string; // URL to reference image
    customization?: {
        decals?: string[];
        typography?: {
            text: string;
            font: string;
            color: string;
            position: 'front' | 'side' | 'rear';
        }[];
        patterns?: {
            type: 'stripes' | 'geometric' | 'custom';
            color: string;
            position: string;
        }[];
    };
}

export interface DesignVersion {
    id: string;
    projectId: string;
    prompt: DesignPrompt;
    createdAt: string;
    imageUrl?: string;
    previewUrl?: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    metadata: {
        aiModel: string;
        generationParams: Record<string, any>;
        score?: number;
    };
}

export interface DesignProject {
    id: string;
    name: string;
    versions: DesignVersion[];
    currentVersion: string; // ID of current version
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    createdAt: string;
    updatedAt: string;
    userId: string;
    sharing: {
        isPublic: boolean;
        sharedWith: string[]; // User IDs
        allowComments: boolean;
        allowDuplication: boolean;
    };
    stats: {
        views: number;
        likes: number;
        downloads: number;
        shares: number;
    };
    tags: string[];
}

export interface DesignComment {
    id: string;
    projectId: string;
    versionId?: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
    reactions: Record<string, string[]>; // reaction type -> user IDs
}

export interface DesignGeneration {
    projectId: string;
    versionId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    error?: string;
    result?: {
        imageUrl: string;
        previewUrl: string;
        variations: string[]; // URLs to variation images
        metadata: {
            aiModel: string;
            generationParams: Record<string, any>;
            processingTime: number;
            quality: {
                resolution: string;
                fidelity: number;
                consistency: number;
            };
        };
    };
}

export interface DesignCollection {
    id: string;
    name: string;
    description: string;
    userId: string;
    projects: string[]; // Project IDs
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
}
