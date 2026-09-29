import Link from "next/link";
import { Divider } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-32 pb-20 text-center">
      <Divider />
      <p className="mt-8 font-display text-8xl text-gold-grad sm:text-9xl">404</p>
      <h1 className="h-display mt-4 text-4xl sm:text-5xl">This stage is empty</h1>
      <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
      <Link href="/" className="btn-gold mt-10">Back to Home</Link>
    </section>
  );
}
