import { rm } from "fs/promises"
import { join } from "path"

global.beforeEach(async () => {
    const dbName = process.env.DB_NAME || 'test.sqlite';
    await rm(join(process.cwd(), dbName), { force: true });
})