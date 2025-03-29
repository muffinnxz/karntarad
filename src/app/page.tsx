"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MobileNav } from "@/components/ui/landing-page/mobile-nav";
import { FeatureCardAdvanced } from "@/components/ui/landing-page/feature-card";
import { AnimatedSection } from "@/components/ui/landing-page/animated-section";

export default function LandingPage() {
    // Use refs instead of state for better performance
    const hasScrolled = useRef(false);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const slideUp = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const slideIn = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-full flex h-16 items-center justify-between py-4 px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2"
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold">Karntarad</span>
                        </Link>
                    </motion.div>
                    <motion.nav
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hidden md:flex items-center gap-6"
                    >
                        <Link
                            href="#features"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#contact"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Contact
                        </Link>
                    </motion.nav>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-4"
                    >
                        <Button asChild className="hidden md:inline-flex">
                            <Link href="/signup">Sign In with Google</Link>
                        </Button>
                        <MobileNav />
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 w-full">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-[calc(100vh-4rem)] flex items-center justify-center">
                    <div className="container mx-auto max-w-full px-4 md:px-6 flex flex-col items-center justify-center">
                        <AnimatedSection
                            delay={0.1}
                            direction="up"
                            className="flex flex-col justify-center space-y-4 text-center"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                                    Level Up Your Marketing Game
                                </h1>
                                <p className="max-w-full text-muted-foreground md:text-xl">
                                    Karntarad is a gamified platform where users
                                    create, manage, and challenge themselves
                                    with social marketing scenarios.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/signup">Play Now</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="#features">Learn More</Link>
                                </Button>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 scroll-margin-top-24"
                >
                    <div className="container mx-auto max-w-full px-4 md:px-6">
                        <AnimatedSection
                            delay={0.1}
                            threshold={0.3}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <div className="inline-block rounded-full bg-black px-3 py-1 text-sm text-white mb-4">
                                Features
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Master Social Marketing Through Play
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Engage with dynamic scenarios, create custom
                                campaigns, and compete in a community-driven
                                environment to refine your marketing skills.
                            </p>
                        </AnimatedSection>

                        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 max-w-7xl mx-auto">
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

                {/* Pricing Section */}
                <section
                    id="pricing"
                    className="w-full py-12 md:py-24 lg:py-32 scroll-margin-top-24"
                >
                    <div className="container mx-auto max-w-full px-4 md:px-6">
                        <AnimatedSection
                            delay={0.1}
                            threshold={0.3}
                            className="flex flex-col items-center justify-center space-y-4 text-center"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Pricing Plans
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Choose the perfect plan for your marketing
                                    simulation needs.
                                </p>
                            </div>
                        </AnimatedSection>
                        <div className="mx-auto grid max-w-7xl gap-6 py-12 lg:grid-cols-3">
                            <AnimatedSection
                                delay={0.2}
                                direction="up"
                                threshold={0.3}
                                className="flex flex-col h-full"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className="h-full"
                                >
                                    <Card className="flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle>Starter</CardTitle>
                                            <CardDescription>
                                                Perfect for individual users
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="text-4xl font-bold">
                                                Free
                                            </div>
                                            <ul className="mt-4 space-y-2">
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Basic scenarios
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Single company
                                                        management
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Community access
                                                    </span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild>
                                                <Link href="/signup">
                                                    Get Started
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatedSection>

                            <AnimatedSection
                                delay={0.3}
                                direction="up"
                                threshold={0.3}
                                className="flex flex-col h-full"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className="h-full"
                                >
                                    <Card className="flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle>Professional</CardTitle>
                                            <CardDescription>
                                                For advanced users and teams
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="text-4xl font-bold">
                                                $29
                                                <span className="text-lg font-normal">
                                                    /month
                                                </span>
                                            </div>
                                            <ul className="mt-4 space-y-2">
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Advanced scenarios
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Multi-company management
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Scenario creation tools
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Performance analytics
                                                    </span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild>
                                                <Link href="/signup">
                                                    Get Started
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatedSection>

                            <AnimatedSection
                                delay={0.4}
                                direction="up"
                                threshold={0.3}
                                className="flex flex-col h-full"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className="h-full"
                                >
                                    <Card className="flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle>Enterprise</CardTitle>
                                            <CardDescription>
                                                For agencies with custom
                                                solutions
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="text-4xl font-bold">
                                                Custom
                                            </div>
                                            <ul className="mt-4 space-y-2">
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Custom scenarios
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Unlimited companies
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Advanced analytics
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Dedicated support
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="ml-2">
                                                        Custom integrations
                                                    </span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild>
                                                <Link href="/contact">
                                                    Contact Sales
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    id="contact"
                    className="w-full py-12 md:py-24 lg:py-32 bg-muted scroll-margin-top-24"
                >
                    <div className="container mx-auto max-w-full px-4 md:px-6">
                        <AnimatedSection
                            delay={0.1}
                            threshold={0.3}
                            className="flex flex-col items-center justify-center space-y-4 text-center"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Ready to level up your marketing game?
                                </h2>
                                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Join thousands of marketers who are already
                                    improving their skills with Karntarad.
                                </p>
                            </div>
                            <motion.div
                                className="flex flex-col gap-2 min-[400px]:flex-row"
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                }}
                            >
                                <Button size="lg" asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/demo">Schedule a Demo</Link>
                                </Button>
                            </motion.div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t py-6 md:py-12">
                <AnimatedSection delay={0.1} threshold={0.1} className="w-full">
                    <div className="container mx-auto max-w-full flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
                        <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <span className="text-lg font-bold">
                                    Karntarad
                                </span>
                            </Link>
                            <p className="text-center text-sm text-muted-foreground md:text-left">
                                A gamified platform for mastering social
                                marketing scenarios.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                            <div className="flex flex-col items-center gap-2 md:items-start">
                                <h3 className="text-sm font-medium">Product</h3>
                                <Link
                                    href="#features"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/demo"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto max-w-full flex flex-col items-center justify-center gap-4 border-t py-4 md:flex-row md:justify-between md:py-6 px-4 md:px-6 mt-4">
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            © {new Date().getFullYear()} Karntarad. All rights
                            reserved.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="https://twitter.com"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                Twitter
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                LinkedIn
                            </Link>
                            <Link
                                href="https://facebook.com"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                Facebook
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </footer>
        </div>
    );
}
