import {mergeRouters} from "@/server/trpc";
import {pingRouter} from "@/server/routers/ping";
import {userRouter} from "@/server/routers/user";
import {mediaRouter} from "@/server/routers/media";
import {postRouter} from "@/server/routers/post";
import {apiRouter} from "@/server/routers/api";
import {socialRouter} from "@/server/routers/social";
import {projectRouter} from "@/server/routers/project";




export const appRouter = mergeRouters(
    pingRouter,
    userRouter,
    mediaRouter,
    postRouter,
    apiRouter,
    socialRouter,
    projectRouter,
);

// export type definition of API
export type AppRouter = typeof appRouter;
