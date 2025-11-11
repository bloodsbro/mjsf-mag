export interface Readable<T> {
    get(params: any): Promise<T[]>;

    getById(id: number): Promise<T>;
}

export interface Createable<T> {
    create(data: T): Promise<T>;
}

export interface Updateable<T> {
    update(id: number, data: T): Promise<T>;
}

export interface Deleteable<T> {
    delete(id: number): Promise<T>;
}

// Aliases to match requested naming in the task
export type Creatable<T> = Createable<T>;
export type Editable<T> = Updateable<T>;
export type Deletable<T> = Deleteable<T>;

// Writable combines create + update operations
export type Writable<T> = Creatable<T> & Editable<T>;
