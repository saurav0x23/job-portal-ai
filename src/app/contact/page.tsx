import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email Us",
      description: "We'll respond quickly",
      details: "support@skillsync.ai",
      action: "mailto:support@skillsync.ai",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Call Us",
      description: "Mon-Fri from 9am-5pm",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Visit Us",
      description: "Come say hello",
      details: "123 Career Street, San Francisco, CA 94107",
      action: "https://maps.google.com",
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Support Hours",
      description: "When we're available",
      details: "Monday - Friday: 9:00 AM - 5:00 PM PST",
      action: "",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-muted-foreground bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground">
          Have questions about our platform or need support? Reach out to our
          team - we're here to help you advance your career.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
        {/* Contact Methods */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p className="text-muted-foreground">
            Connect with us through any of these channels. Our support team
            typically responds within 24 hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="p-6 border border-border rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  {method.icon}
                  <h3 className="text-lg font-semibold">{method.title}</h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  {method.description}
                </p>
                <p className="font-medium">{method.details}</p>
                {method.action && (
                  <Button variant="link" className="px-0 mt-4" asChild>
                    <a href={method.action}>Contact via {method.title}</a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border h-fit rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Your Name
                </label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help?" required />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Your message here..."
                className="resize-none"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
