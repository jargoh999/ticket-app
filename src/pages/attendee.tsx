"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Upload } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { toast } from 'sonner'

export default function AttendeeDetails() {
    const router = useRouter()
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

    // Safely initialize form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialRequest: ''
    })

    // Use effect to load data from localStorage after component mounts
    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
            const storedTicket = localStorage.getItem('selectedTicket')
            if (storedTicket) {
                const parsedTicket = JSON.parse(storedTicket)

                // Update form data
                setFormData({
                    name: parsedTicket?.attendeeDetails?.name || '',
                    email: parsedTicket?.attendeeDetails?.email || '',
                    specialRequest: parsedTicket?.attendeeDetails?.specialRequest || ''
                })

                // Update selected file
                if (parsedTicket?.attendeeDetails?.profileImageUrl) {
                    setSelectedFile(parsedTicket.attendeeDetails.profileImageUrl)
                }
            }
        }
    }, [])

    useEffect(() => {
        // Reset local state when navigating away
        const handleRouteChange = () => {
            // Reset local state
            setFormData({
                name: '',
                email: '',
                specialRequest: ''
            })
            setSelectedFile(null)
            setErrors({
                name: false,
                email: false,
                file: false,
                specialRequest: false
            })
        }

        router.events.on('routeChangeStart', handleRouteChange)

        // Cleanup event listener
        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [router])

    const handleBack = () => {
        // Navigate back to the previous page
        router.back()
    }

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        file: false,
        specialRequest: false
    })

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return re.test(String(email).toLowerCase())
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
            const maxSize = 5 * 1024 * 1024

            if (!allowedTypes.includes(file.type)) {
                toast.error('Invalid file type', {
                    description: 'Please upload a JPEG, PNG, or GIF image'
                })
                setErrors(prev => ({ ...prev, file: true }))
                return
            }

            if (file.size > maxSize) {
                toast.error('File too large', {
                    description: 'Maximum file size is 5MB'
                })
                setErrors(prev => ({ ...prev, file: true }))
                return
            }

            // Reset previous upload state
            setIsUploading(true)
            setUploadedImageUrl(null)
            setSelectedFile(file)
            setErrors(prev => ({ ...prev, file: false }))

            const formData = new FormData()
            formData.append('file', file)

            try {
                toast.info('Uploading file...', {
                    description: 'Please wait while your profile picture is being processed'
                })

                const response = await axios.post('https://file-upload-as-a-service.onrender.com/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (response.data.secure_url) {
                    setUploadedImageUrl(response.data.secure_url)
                    setSelectedFile(response.data.secure_url)

                    toast.success('Profile picture uploaded', {
                        description: 'Your profile picture is now set'
                    })
                }
            } catch (error) {
                toast.error('Upload failed', {
                    description: 'Please try again or check your connection'
                })
                setSelectedFile(null)
                setUploadedImageUrl(null)
                console.error('Upload failed', error)
            } finally {
                setIsUploading(false)
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))

        if (id === 'name') {
            setErrors(prev => ({ ...prev, name: value.trim() === '' }))
        }

        if (id === 'email') {
            setErrors(prev => ({ ...prev, email: !validateEmail(value) }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const newErrors = {
            name: formData.name.trim() === '',
            email: !validateEmail(formData.email),
            file: !selectedFile,
            specialRequest: formData.specialRequest.trim() === ''
        }

        setErrors(newErrors)

        // Check if any errors exist
        const hasErrors = Object.values(newErrors).some(error => error)

        if (hasErrors) {
            toast.error('Validation Failed', {
                description: 'Please fill all required fields correctly'
            })
            return
        }

        // Check if image is still uploading
        if (isUploading) {
            toast.warning('Image Upload in Progress', {
                description: 'Please wait for the profile picture to finish uploading'
            })
            return
        }

        const storedTicket = localStorage.getItem('selectedTicket')
        if (!storedTicket) {
            toast.error('No ticket selected', {
                description: 'Please select a ticket first'
            })
            return
        }

        const ticket = JSON.parse(storedTicket)

        const updatedTicket = {
            ...ticket,
            attendeeDetails: {
                name: formData.name,
                email: formData.email,
                specialRequest: formData.specialRequest,
                profileImageUrl: uploadedImageUrl ||
                    (typeof selectedFile === 'string' ? selectedFile : null)
            }
        }

        localStorage.setItem('selectedTicket', JSON.stringify(updatedTicket))

        toast.success('Form Submitted Successfully', {
            description: 'Your details have been recorded'
        })

        router.push('/ticket')
    }

    return (
        <div className="min-h-screen bg-[#001a1a]">
            <nav className="space-x-10 pt-[10px]">
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between rounded-3xl border-teal-500/10 border-2">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className="text-white hover:bg-teal-900 bg-teal-900"
                    >
                        ← Back
                    </Button>
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
            <div className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit}>
                    <Card className="bg-[#002626] border-teal-900/30">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-gray-100">Attendee Details</h2>
                                <span className="text-sm text-gray-400">Step 2/3</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-400">Upload Profile Photo *</Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center 
                                        ${dragActive ? "border-[#26B6B6] bg-[#26B6B6]/5" : "border-teal-900/30"}
                                        ${errors.file ? "border-red-500" : ""}`
                                    }
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrag}
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="fileUpload"
                                        accept="image/jpeg,image/png,image/gif"
                                    />
                                    <label htmlFor="fileUpload" className="cursor-pointer">
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-[#26B6B6]" />
                                            <p className="text-sm text-gray-400">
                                                {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag & drop or click to upload'}
                                            </p>
                                        </div>
                                    </label>
                                    {errors.file && <p className="text-red-500 text-xs mt-2">Profile photo is required</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm text-gray-400">
                                        Enter your name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`bg-transparent border-teal-900/30 focus:border-[#26B6B6] focus:ring-[#26B6B6] text-gray-100 
                                            ${errors.name ? "border-red-500" : ""}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm text-gray-400">
                                        Enter your email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`bg-transparent border-teal-900/30 focus:border-[#26B6B6] focus:ring-[#26B6B6] text-gray-100 
                                            ${errors.email ? "border-red-500" : ""}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">Invalid email address</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialRequest" className="text-sm text-gray-400">
                                        Special request? *
                                    </Label>
                                    <Textarea
                                        id="specialRequest"
                                        value={formData.specialRequest}
                                        onChange={handleInputChange}
                                        placeholder="Your special request"
                                        className={`bg-transparent border-teal-900/30 focus:border-[#26B6B6] focus:ring-[#26B6B6] text-gray-100 min-h-[120px] 
                                            ${errors.specialRequest ? "border-red-500" : ""}`}
                                    />
                                    {errors.specialRequest && <p className="text-red-500 text-xs mt-1">Special request is required</p>}
                                </div>
                            </div>
                        </CardContent>
                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 px-2 sm:px-4 items-center justify-center space-y-5 sm:space-y-0 sm:space-x-[100px] mb-5">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-[250px] h-12 sm:h-[50px] text-xs sm:text-base text-gray-400 hover:text-gray-100 hover:bg-transparent bg-sticky border-2 border-teal-900/50"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-[250px] h-12 sm:h-[50px] text-xs sm:text-base bg-teal-500 hover:bg-teal-600"
                            >
                                Get My Free Trial
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    )
}