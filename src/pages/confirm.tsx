import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-[#001a1a]">
            {/* Navigation */}
            <nav className="border-b border-teal-900/30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                            tiez
                        </span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/attendee" className="text-gray-300 hover:text-teal-400">
                            Events
                        </Link>
                        <Link href="/ticket" className="text-gray-300 hover:text-teal-400">
                            My Tickets
                        </Link>
                        <Link href="/confirm" className="text-gray-300 hover:text-teal-400">
                            About Project
                        </Link>
                        <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500/10">
                            MY TICKETS →
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="bg-[#002626] border-teal-900/30">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {/* Project Title */}
                            <div className="mb-8">
                                <h1 className="text-xl text-gray-300 mb-2">
                                    Event Ticket Booking UI - Open Source Practice Project 🎫
                                </h1>
                                <h2 className="text-lg text-teal-400 mb-4">Overview</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    This is a beginner friendly yet practical Event Ticket Booking UI designed for developers to clone,
                                    explore, and build upon. The design focuses on a seamless, login-free ticket reservation flow,
                                    allowing users to book event tickets quickly and efficiently.
                                </p>
                                <p className="text-gray-400 mt-4 leading-relaxed">
                                    The project consists of a three-step ticket booking flow, and developers can extend it further by
                                    integrating payment solutions, user authentication (optional), and ticket validation systems.
                                </p>
                            </div>

                            {/* Flow & Features */}
                            <div>
                                <h2 className="text-lg text-teal-400 mb-4">Flow & Features</h2>
                                <div className="space-y-6">
                                    <Section
                                        title="🎫 Ticket Selection"
                                        items={[
                                            "Users can browse available tickets (Free & Paid).",
                                            "Ticket options are displayed in a list or card view.",
                                            'For Free Tickets — Clicking "Get Free Ticket" proceeds to attendee details.',
                                            'For Paid Tickets — Clicking "Purchase Ticket" would ideally open a payment modal.',
                                        ]}
                                    />

                                    <Section
                                        title="📝 Attendee Details Form"
                                        items={[
                                            "Users input their Name, Email, and optional Phone Number.",
                                            "Profile picture upload option with preview functionality.",
                                            "Ticket summary is visible to ensure users review their details before submission.",
                                        ]}
                                    />

                                    <Section
                                        title="✅ Payment & Success Page"
                                        items={[
                                            "If the ticket is free, the user is taken directly to the Ticket Confirmation Page.",
                                            "If the ticket is a paid ticket option, users can use Stripe, PayStack, or Flutterwave to process payment before showing the confirmation page.",
                                            "Upon successful booking, users should receive:",
                                            "• A visual ticket preview with a unique QR Code",
                                            "• An option to download the ticket as PDF or save it to their device.",
                                            "• An email confirmation containing ticket details.",
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Implementation Details */}
                            <div>
                                <h2 className="text-lg text-teal-400 mb-2">How to Build This 🚀</h2>
                                <p className="text-gray-400 mb-4">This UI can be implemented using:</p>

                                <Section
                                    title="📌 Frontend (Next.js or React)"
                                    items={[
                                        "Component Breakdown:",
                                        "• TicketCard.tsx — Displays ticket details",
                                        "• AttendeeForm.tsx — Captures user details",
                                        "• PaymentModal.tsx — Handles the payment section",
                                        "• SuccessScreen.tsx — Shows the final ticket preview",
                                        "• State Management: React's Context API, Zustand, or Redux (if needed)",
                                        "• File Handling: Users should be able to upload images (profile picture for ticket) using Firebase Storage, Cloudinary or local preview with URL.createObjectURL()",
                                    ]}
                                />

                                <Section
                                    title="📌 Backend (Optional)"
                                    items={[
                                        "If persistence is required, a backend can be built using:",
                                        "• Node.js & Express or Firebase Functions",
                                        "• Database: MongoDB, PostgreSQL, or Firebase Firestore to store ticket records",
                                    ]}
                                />

                                <Section
                                    title="📌 Payment Integration"
                                    items={[
                                        "For paid events, developers should integrate:",
                                        "• Stripe Checkout (for international transactions)",
                                        "• PayStack or Flutterwave (for African markets)",
                                    ]}
                                />
                            </div>

                            {/* What You'll Learn */}
                            <div>
                                <h2 className="text-lg text-teal-400 mb-4">What You'll Learn 📚</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>File handling & validation (profile picture uploads)</li>
                                    <li>Dynamic UI updates based on ticket selection</li>
                                    <li>Persisting bookings using local state or a backend</li>
                                    <li>Integrating payment gateways for ticket purchases</li>
                                    <li>Generating & validating QR Codes for event check-in (Advanced)</li>
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-8 space-y-6">
                                <div className="text-4xl">💛 Enjoy</div>
                                <div className="flex justify-center space-x-4">
                                    <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500/10">
                                        Design File
                                    </Button>
                                    <Button className="bg-teal-500 hover:bg-teal-600">
                                        <Github className="mr-2 h-4 w-4" />
                                        Github code
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

interface SectionProps {
    title: string
    items: string[]
}

function Section({ title, items }: SectionProps) {
    return (
        <div className="space-y-2">
            <h3 className="text-gray-300">{title}</h3>
            <ul className="list-none space-y-2 text-gray-400">
                {items.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

