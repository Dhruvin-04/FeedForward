'use client'
import Navbar from "@/components/web/Navbar"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
    const [role, setRole] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchrole = localStorage.getItem('role')
        if (fetchrole) setRole(fetchrole)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // For now, log and show toast
        console.log('Contact form submitted:', formData)
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.')
            setFormData({ name: '', email: '', subject: '', message: '' })
            setIsSubmitting(false)
        }, 500)
    }

    return (
        <>
            <Navbar role={role.toLowerCase()} userName="" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                * { font-family: 'Poppins', sans-serif; }
                .font-berkshire { font-family: 'Berkshire Swash', cursive; }
            `}</style>

            {/* Header */}
            <section className="bg-linear-to-br from-orange-50 via-white to-green-50 py-16 px-6 text-center">
                <h1 className="font-berkshire text-5xl text-gray-900">Get in Touch</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
                    Have questions or want to partner with us? We&apos;d love to hear from you.
                </p>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Contact Info */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Contact Information</h2>
                        <p className="text-gray-600 mb-10">
                            Reach out to us through any of the channels below, or fill out the form and we&apos;ll respond as soon as possible.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-3 rounded-full shrink-0">
                                    <Mail className="size-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">support@feedforward.org</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-full shrink-0">
                                    <Phone className="size-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+91 XXXXX XXXXX</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full shrink-0">
                                    <MapPin className="size-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Location</h3>
                                    <p className="text-gray-600">India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    placeholder="What's this about?"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                                    placeholder="Tell us more..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-60"
                            >
                                <Send className="size-5" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
