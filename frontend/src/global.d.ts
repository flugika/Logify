// src/global.d.ts
declare namespace YT {
    interface Player {
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number): void;
        setVolume(volume: number): void;
        getVolume(): number;
        destroy(): void;
        getVideoUrl(): string;
    }

    interface PlayerOptions {
        height?: string;
        width?: string;
        videoId: string;
        events?: {
            onReady?: (event: PlayerEvent) => void;
            onStateChange?: (event: PlayerEvent) => void;
            onError?: (event: PlayerEvent) => void;
        };
    }

    interface PlayerEvent {
        data: number;
        target: Player;
    }
}
