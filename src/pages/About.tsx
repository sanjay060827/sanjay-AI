import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, Linkedin, Code2, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About MEC Canteen
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern digital solution for campus dining
          </p>
        </div>

        {/* Project Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">About the Project</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The Madras Engineering College Canteen Management System is a comprehensive digital platform
              designed to streamline the campus dining experience. This project aims to reduce waiting times,
              improve order accuracy, and provide students with a seamless way to order their favorite meals.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built with modern web technologies, the system features real-time order tracking, multiple
              payment options, reward points, an AI chatbot assistant, and support for diverse international
              cuisines - all tailored for the MEC campus community.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  ✨
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Ordering</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse menu, customize orders, and track in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    CanteenMate chatbot for instant help and recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  💳
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multiple Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    UPI, cards, net banking, and cash options
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  🎁
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Rewards Program</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn and redeem points with every purchase
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  🌍
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Global Cuisines</h3>
                  <p className="text-sm text-muted-foreground">
                    Indian, Chinese, Japanese, Italian, Mexican & more
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  📱
                </div>
                <div>
                  <h3 className="font-semibold mb-1">QR Code Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick and contactless order collection
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl font-bold text-white flex-shrink-0">
                SS
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">Sanjay Sivakumar</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Computer Science Engineering Student<br />
                  Madras Engineering College
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  This project was developed as part of the college curriculum to demonstrate practical
                  application of modern web technologies in solving real-world campus problems. The goal
                  was to create a user-friendly, efficient system that enhances the daily dining experience
                  for students and staff.
                </p>
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://github.com/SanjayProjects" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="mailto:sanjay.cse@madrasengg.ac.in">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://linkedin.com/in/sanjaysivakumar" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Vite",
                "Supabase",
                "React Query",
                "shadcn/ui",
                "Web Speech API",
                "QR Code Generation",
                "Responsive Design",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 text-muted-foreground">
          <Heart className="h-6 w-6 mx-auto mb-2 text-red-500 fill-red-500" />
          <p>Made with passion for Madras Engineering College</p>
          <p className="text-sm mt-2">© 2025 MEC Canteen Management System</p>
        </div>
      </div>
    </div>
  );
}
