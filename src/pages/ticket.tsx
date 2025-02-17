import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'sonner'

// Define ticket interface to match the one in index.tsx
interface Ticket {
    id: string
    name: string
    price: number
    description: string
    type: 'free' | 'paid'
    attendeeDetails?: {
        name: string
        email: string
        profileImageUrl: string
        specialRequests?: string
    }
}

export default function TicketCard() {
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
            // Retrieve ticket and attendee details from localStorage
            const storedTicket = localStorage.getItem('selectedTicket')

            if (storedTicket) {
                try {
                    const parsedTicket = JSON.parse(storedTicket)
                    setTicket(parsedTicket)
                } catch (error) {
                    toast.error('Error retrieving ticket details', {
                        description: 'Unable to parse ticket information'
                    })
                    router.push('/') // Redirect to home if ticket data is invalid
                }
            } else {
                toast.error('No ticket selected', {
                    description: 'Please select a ticket first'
                })
                router.push('/') // Redirect to home if no ticket is selected
            }
        }
    }, [router])

    // If no ticket is loaded, show a loading state
    if (!ticket) {
        return (
            <div className="min-h-screen bg-[#001a1a] flex items-center justify-center">
                <p className="text-white">Loading ticket details...</p>
            </div>
        )
    }

    return (
        <div className="bg-[#001a1a]">
            {/* Navigation remains the same */}
            <nav className="space-x-10 pt-[10px]">
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between rounded-3xl border-teal-500/10 border-2">
                    <Link href="/" className="flex items-center mb-4 sm:mb-0 sm:pl-10">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                            tiez
                        </span>
                    </Link>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <Link href="/attendee" className="text-sm sm:text-base text-gray-400 hover:text-teal-400">
                            Events
                        </Link>
                        <Link href="/ticket" className="text-sm sm:text-base text-gray-400 hover:text-teal-400">
                            My Tickets
                        </Link>
                        <Link href="/about" className="text-sm sm:text-base text-gray-400 hover:text-teal-400">
                            About Project
                        </Link>
                    </div>
                    <Button variant="outline" className="mt-4 sm:mt-0 sm:ml-[70px] text-xs sm:text-sm text-black font-light rounded-xl">
                        MY TICKETS →
                    </Button>
                </div>
            </nav>

            <div className="min-h-screen bg-[#001a1a] flex items-center justify-center p-6">
                <div className="ticket-container w-full max-w-[400px] relative">
                    <div className="ticket-inner bg-[#002626] p-6 text-center relative">
                        {/* Event Details */}
                        <h1 className="text-4xl font-bold text-white mb-4">Techember Fest '25</h1>
                        <div className="text-teal-400 text-sm space-y-1 mb-6">
                            <p>📍 04 Rumens road, Ikoyi, Lagos</p>
                            <p>📅 March 15, 2025 | 7:00 PM</p>
                        </div>

                        {/* Profile Image */}
                        <div className="mb-8">
                            <div
                                className="w-28 h-28 mx-auto rounded-lg overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                                <img
                                    src={ticket.attendeeDetails?.profileImageUrl || '/placeholder.svg'}
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-cover brightness-125" />
                            </div>
                        </div>
                        <Card className="w-full max-w-[400px] relative p-6 bg-[#08343c] mb-3 border-teal-500/30 border-2">
                            {/* Form Section */}
                            <CardHeader className="text-center">
                                <h1 className="text-2xl font-bold text-teal-400">Event Ticket</h1>
                            </CardHeader>
                            <CardContent>
                                {/* Ticket Type */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-400">Ticket Type</p>
                                    <p className="text-lg font-semibold text-white capitalize">
                                        {ticket.name} ({ticket.type})
                                    </p>
                                </div>

                                {/* Attendee Details */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-400">Attendee Name</p>
                                    <p className="text-lg font-semibold text-white">
                                        {ticket.attendeeDetails?.name || 'Not provided'}
                                    </p>
                                </div>

                                {/* Contact Details */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="text-lg font-semibold text-white">
                                        {ticket.attendeeDetails?.email || 'Not provided'}
                                    </p>
                                </div>

                                {/* Special Requests */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-400">Special Requests</p>
                                    <p className="text-md text-white">
                                        {ticket.attendeeDetails?.specialRequests || 'Nil'}
                                    </p>
                                </div>

                                {/* QR Code Placeholder */}
                                <div className="flex justify-center items-center mt-6 p-4 bg-teal-900/20 rounded-lg">
                                    <QrCode className="w-24 h-24 text-teal-400" />
                                    <p className="ml-4 text-gray-300">Ticket Verification QR</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Barcode Section */}
                        <div className="pt-4 border-t-2 border-dashed border-teal-500/30">
                            <div className="inline-block">
                                <svg className="w-48 h-16 mx-auto mb-2" viewBox="0 0 200 60">
                                    <rect x="0" y="0" width="200" height="60" fill="none" />
                                    {/* Barcode lines */}
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <rect
                                            key={i}
                                            x={i * 6}
                                            y="0"
                                            width="3"
                                            height="50"
                                            fill="#fff"
                                            opacity={Math.random() > 0.5 ? 1 : 0.3} />
                                    ))}
                                </svg>
                                <p className="text-teal-400 text-sm tracking-[0.2em]">234567 891026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .ticket-container {
          --notch-height: 20px;
          --border-width: 2px;
          --border-color: rgba(20, 184, 166, 0.3);
          --bg-color: #002626;
          --circle-size: 60px;
           position: relative;
        }

        .ticket-container::before,
        .ticket-container::after {
          content: '';
          position: absolute;
          width: var(--circle-size);
          height: var(--circle-size);
          background-color: var(--bg-color);
          border-radius: 50%;
          z-index: 10;
        
        //   box-shadow: 
        //   0 -5px 10px -3px rgba(38, 182, 182, 0.3), /* Soft glow for top circles */
        //   5px 0 10px -3px rgba(38, 182, 182, 0.3);  /* Soft glow for right side */
}

        .ticket-container::before {
          top: -40px;
          left: -50px;
          transform: translate(50%, 50%);
        }

        .ticket-container::after {
           top: -40px; 
           right: -50px; 
           transform: translate(-50%, 50%);
        }

        
        .ticket-container::after {
          bottom: 0;
          border-radius: 0 0 24px 24px;
          border-top: none;  
        }
        

        .ticket-inner {
          border: var(--border-width) solid var(--border-color);
          border-radius: 24px;
          margin: var(--notch-height) 0;
        }

        .ticket-container::before,
        .ticket-container::after,
        .ticket-inner::before,
        .ticket-inner::after {
          content: '';
          position: absolute;
          width: var(--circle-size);
          height: var(--circle-size);
          background-color: #001a1a;
          border-radius: 50%;
          z-index: 2;
        }

        .ticket-inner::before {
          bottom: calc(var(--circle-size) / -2);
          left: calc(var(--circle-size) / -2);
        }

        .ticket-inner::after {
          bottom: calc(var(--circle-size) / -2);
          right: calc(var(--circle-size) / -2);
        }
      `}</style>
        </div>
    )
}
