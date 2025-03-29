"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileNav } from "@/components/landing-page/mobile-nav";
import { FeatureCardAdvanced } from "@/components/landing-page/feature-card";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileButton } from "@/components/profile-button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function LandingPage() {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div {...fadeInUp} className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Karntarad
            </Link>
          </motion.div>

          <motion.nav {...fadeInUp} className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </motion.nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            {!loading && (
              <>
                {user ? (
                  <ProfileButton />
                ) : (
                  <Button asChild className="hidden md:inline-flex">
                    <Link href="/signin">Sign In with Google</Link>
                  </Button>
                )}
              </>
            )}
            <MobileNav />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl">Level Up Your Marketing Game</h1>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Karntarad is a gamified platform where users create, manage, and challenge themselves with social
                marketing scenarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Play Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <div className="inline-block rounded-full bg-black px-3 py-1 text-sm text-white mb-4">Features</div>
              <h2 className="text-3xl font-bold sm:text-5xl mb-4">Master Social Marketing Through Play</h2>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Engage with dynamic scenarios, create custom campaigns, and compete in a community-driven environment.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
              <FeatureCardAdvanced
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                }
                title="Dynamic Scenarios"
                description="Experience ever-changing marketing challenges that simulate real-world social media trends."
                delay={0.1}
              />
              <FeatureCardAdvanced
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                }
                title="Multi-Company Play"
                description="Manage multiple companies simultaneously and test diverse strategies in parallel game sessions."
                delay={0.2}
              />
              <FeatureCardAdvanced
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                title="Community Challenges"
                description="Create and share your own marketing scenarios, or take on challenges crafted by fellow players."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-5xl mb-4">Pricing Plans</h2>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                For now, enjoy our free plan and gain full access to every function of Karntarad.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for individual users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">Free</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="ml-2">Full access to all functions</span>
                    </li>
                    <li className="flex items-center">
                      <span className="ml-2">Unlimited scenario creation</span>
                    </li>
                    <li className="flex items-center">
                      <span className="ml-2">Complete company management</span>
                    </li>
                    <li className="flex items-center">
                      <span className="ml-2">Community access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-12 md:py-24 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold sm:text-5xl">Ready to level up your marketing game?</h2>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Join thousands of marketers who are already improving their skills with Karntarad.
              </p>
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <Link href="/" className="text-lg font-bold">
                Karntarad
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                A gamified platform for mastering social marketing scenarios.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
