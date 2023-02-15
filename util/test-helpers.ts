import SocketIO from 'socket.io';
import {Request, Response} from 'express';

export function createSocketIO() {
    const emit = jest.fn((event, msg) => null);
    return {
        to: jest.fn(() => ({ emit })),
    } as unknown as SocketIO.Server;
}

export function createRequest() {
    return {
        body: {},
        params: {},
    } as unknown as Request;
}

export function createResponse() {
    const res = {};
    return {
        status: jest.fn((status: number) => res),
        json: jest.fn(() => null),
    } as unknown as Response;
}