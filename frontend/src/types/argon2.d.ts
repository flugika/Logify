declare module 'argon2' {
    export function hash(password: string, options?: any): Promise<string>;
    export function verify(hash: string, password: string, options?: any): Promise<boolean>;
}
