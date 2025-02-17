'use client'
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@radix-ui/react-select"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { toast } from "sonner"

// Define ticket types
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
  }
}

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(() => {
    // Initialize with ticket from localStorage if exists
    if (typeof window !== 'undefined') {
      const storedTicket = localStorage.getItem('selectedTicket')
      return storedTicket ? JSON.parse(storedTicket) : null
    }
    return null
  })
  const router = useRouter()

  // Sample ticket data
  const tickets: Ticket[] = [
    {
      id: 'free-1',
      name: 'Basic Free Ticket',
      price: 0,
      description: 'Access to main event hall',
      type: 'free'
    },
    {
      id: 'paid-1',
      name: 'VIP Ticket',
      price: 50,
      description: 'Premium seating, exclusive access',
      type: 'paid'
    },
    {
      id: 'paid-2',
      name: 'VIP Ticket',
      price: 150,
      description: 'Premium seating, exclusive access',
      type: 'paid'
    }

  ]

  // Handle ticket selection using only localStorage
  const handleTicketSelect = (ticket: Ticket) => {
    try {
      // Save to localStorage
      localStorage.setItem('selectedTicket', JSON.stringify(ticket))

      // Update state
      setSelectedTicket(ticket)

      toast.success(`${ticket.name} selected`, {
        description: ticket.type === 'free'
          ? 'Proceed to attendee details'
          : 'Proceed to payment'
      })
    } catch (error) {
      toast.error('Failed to select ticket', {
        description: 'Please try again'
      })
    }
  }

  // Check ticket details in localStorage
  const checkTicketDetailsInLocalStorage = () => {
    const storedTicket = localStorage.getItem('selectedTicket')
    if (storedTicket) {
      const ticket = JSON.parse(storedTicket)
      return ticket.attendeeDetails?.name &&
        ticket.attendeeDetails?.email &&
        ticket.attendeeDetails?.profileImageUrl
    }
    return false
  }

  // Handle next button click
  const handleNext = () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket', {
        description: 'You must choose a ticket to proceed'
      })
      return
    }

    const hasCompleteDetails = checkTicketDetailsInLocalStorage()

    if (hasCompleteDetails) {
      // Route to ticket page if details are complete
      router.push('/ticket')
    } else {
      // Route to attendee page if details are incomplete
      router.push('/attendee')
    }
  }

  useEffect(() => {
    // Reset local state when navigating away
    const handleRouteChange = () => {
      // Reset only local state, keep localStorage intact
      setSelectedTicket(null)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // Cleanup event listener
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#031e23] px-2 sm:px-4 md:px-6">
      {/* Navigation */}
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
            <Link href="/confirm" className="text-sm sm:text-base text-gray-400 hover:text-teal-400">
              About Project
            </Link>
          </div>
          <Button variant="outline" className="mt-4 sm:mt-0 sm:ml-[70px] text-xs sm:text-sm text-black font-light rounded-xl">
            MY TICKETS →
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8 opacity-95">
        <Card className="bg-[#041e23] border-teal-500/30 p-3 sm:p-10 rounded-3xl">
          <CardContent className="space-y-6">
            <Card className="bg-[#08252b] p-3 sm:p-5 border-teal-900/30 border-2 rounded-3xl">
              <Card className="bg-gradient-to-br from-[#0c3840]/100 via-[#082228]/10 to-[#082228]/100 border-teal-900/30 rounded-3xl">
                <CardContent className="py-6 px-2 sm:px-6">
                  <h1 className="font-Road Rage italic text-2xl sm:text-3xl font-bold text-center text-gray-100 mb-2 p-3 sm:p-5 text-opacity-70">Techember Fest &apos;25</h1>
                  <p className="text-center text-xs sm:text-base text-gray-400 mb-4 mx-2 sm:m-7">
                    Join us for an unforgettable experience at<br /> [Event Name].
                    Secure your spot now.
                  </p>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-base text-gray-400">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                    <span className="truncate">[Event Location]</span>
                    <span>| |</span>
                    <span>March 15, 2025 | 7:00 PM</span>
                  </div>
                </CardContent>
              </Card>

              <Separator className="h-0.5 sm:h-1 w-full sm:w-[670px] bg-teal-500/10 my-3 sm:m-5 rounded-full" />
              <h3 className="text-xs sm:text-base text-gray-400 mb-2 sm:mb-4">Select Ticket Type:</h3>

              {/* Ticket Types */}
              <div className="px-2 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  {tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`bg-[#052228] border-teal-900/100 hover:border-teal-500 cursor-pointer transition-colors border-2 
                        ${selectedTicket?.id === ticket.id
                          ? 'border-teal-500 shadow-lg'
                          : 'border-teal-900/30 hover:border-teal-500'}`}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <CardContent className="p-2 sm:p-4">
                        <div className="text-base sm:text-2xl font-bold text-gray-100 mb-1 sm:mb-2">{ticket.price === 0 ? 'FREE' : `$${ticket.price}`}</div>
                        <div className="text-xs sm:text-sm text-gray-400">{ticket.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{ticket.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Number of Tickets */}
              <div className="mt-4 px-2 sm:px-4">
                <h3 className="text-xs sm:text-base text-gray-400 mb-2 sm:mb-4">Number of Tickets</h3>
                <Select defaultValue="1">
                  <SelectTrigger className="w-full bg-[#003333] border-teal-500/10 text-xs sm:text-base text-gray-200">
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-xs sm:text-base  bg-[#003333] text-gray-200">
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </CardContent>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 px-2 sm:px-4 items-center justify-center space-y-5 sm:space-y-0 sm:space-x-[100px]">
            <Button
              variant="outline"
              className="w-full sm:w-[250px] h-12 sm:h-[50px] text-xs sm:text-base text-gray-400 hover:text-gray-100 hover:bg-transparent bg-sticky border-2 border-teal-900/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              className="w-full sm:w-[250px] h-12 sm:h-[50px] text-xs sm:text-base bg-teal-500 hover:bg-teal-600"
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
