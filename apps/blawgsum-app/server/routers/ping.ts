import {publicProcedure, router} from "@/server/trpc";

export const pingRouter = router({
    hello: publicProcedure.query(async () => "hello"),
});
