import type { Request, Response } from "express";

export default function Health(req: Request, res: Response){
    const seconds = process.uptime();

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const uptime = `${hours}h ${minutes}m ${secs}s`;

    res.json(
        {
            "uptime": uptime,
            "message": "OK",
            "timestamp": new Date().toISOString()
        }
    )
}