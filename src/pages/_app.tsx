import { withTRPC } from "@trpc/next";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import "../styles/globals.css";
import { AppRouter } from "./api/trpc/[trpc]";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

const getBaseUrl = () => {
  if (typeof window != "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: `${getBaseUrl()}/api/trpc`,
      links: [
        typeof window !== "undefined"
          ? wsLink({
              client: createWSClient({
                url: `ws://localhost:3001`,
              }),
            })
          : () => {},
      ],
    };
  },
  ssr: true,
})(MyApp);
