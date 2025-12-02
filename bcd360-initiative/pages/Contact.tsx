import React, { useState } from 'react';
import { Mail, Phone, MapPin, CreditCard, Send, Loader2 } from 'lucide-react';
import { CONTACT_INFO, BANK_DETAILS } from '../constants';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../LanguageContext';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'permission-error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', address: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      console.error("Error adding document: ", error);
      if (error.code === 'permission-denied') {
        setSubmitStatus('permission-error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">
            {isFR ? 'Contactez-nous' : 'Get in Touch'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isFR
              ? 'Nous serions ravis d’échanger avec vous. Remplissez le formulaire ci-dessous ou contactez-nous directement.'
              : "We'd love to hear from you. Fill out the form below or reach out to us directly."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {isFR ? 'Envoyez-nous un message' : 'Send us a Message'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {isFR ? 'Nom' : 'Name'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" id="name" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder={isFR ? 'Votre nom complet' : 'Your full name'}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" id="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder={isFR ? 'vous@exemple.com' : 'you@example.com'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {isFR ? 'Téléphone' : 'Phone'}
                  </label>
                  <input 
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>
                 <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {isFR ? 'Adresse' : 'Address'}
                  </label>
                  <input 
                    type="text" id="address" name="address"
                    value={formData.address} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {isFR ? 'Message' : 'Message'} <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message" name="message" rows={4} required
                  value={formData.message} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  placeholder={isFR ? 'Comment pouvons-nous vous aider ?' : 'How can we help?'}
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium animate-fade-in">
                  {isFR
                    ? 'Merci ! Votre message a été reçu. Nous vous contacterons très bientôt.'
                    : 'Thank you! Your message has been received. We will contact you shortly.'}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium animate-fade-in">
                  {isFR
                    ? 'Une erreur s’est produite. Veuillez réessayer plus tard ou nous écrire directement par email.'
                    : 'Something went wrong. Please try again later or email us directly.'}
                </div>
              )}

               {submitStatus === 'permission-error' && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-medium animate-fade-in">
                  {isFR
                    ? <>Les soumissions en ligne ne sont pas disponibles pour le moment. Veuillez nous écrire à <a href={`mailto:${CONTACT_INFO.officialEmail}`} className="underline font-bold">{CONTACT_INFO.officialEmail}</a>.</>
                    : <>Online submissions are currently unavailable. Please email us at <a href={`mailto:${CONTACT_INFO.officialEmail}`} className="underline font-bold">{CONTACT_INFO.officialEmail}</a>.</>}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> {isFR ? 'Envoi en cours...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {isFR ? 'Envoyer le message' : 'Send Message'} <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info & Donation */}
          <div className="space-y-8">
            
            {/* Contact Info Cards */}
            <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-secondary">
              <h3 className="text-xl font-bold text-dark mb-6">
                {isFR ? 'Informations de contact' : 'Contact Information'}
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0"><MapPin size={20}/></div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-dark mb-1">
                      {isFR ? 'Siège' : 'Headquarters'}
                    </p>
                    <p className="mb-2">{CONTACT_INFO.address1}</p>
                    <p>{CONTACT_INFO.address2}</p>
                  </div>
                </li>
                 <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0"><Phone size={20}/></div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-dark mb-1">
                      {isFR ? 'Téléphone' : 'Phone'}
                    </p>
                    <p>{CONTACT_INFO.phone}</p>
                    <p>{CONTACT_INFO.altPhone}</p>
                  </div>
                </li>
                 <li className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0"><Mail size={20}/></div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-dark mb-1">
                      Email
                    </p>
                    <p>{CONTACT_INFO.email}</p>
                    <p>{CONTACT_INFO.officialEmail}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Donation Card */}
             <div className="bg-gradient-to-br from-primary to-blue-900 p-8 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <CreditCard size={24} className="text-secondary"/>
                 </div>
                 <h3 className="text-2xl font-serif font-bold">
                   {isFR ? 'Soutenez notre travail' : 'Support Our Work'}
                 </h3>
              </div>
              <p className="text-blue-100 mb-6 text-sm">
                {isFR
                  ? 'Votre contribution nous aide à poursuivre notre mission de soutien aux personnes marginalisées dans les zones rurales et périurbaines.'
                  : 'Your contribution helps us continue our mission to support marginalized individuals in the hinterlands and suburbs.'}
              </p>
              
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">{isFR ? 'Banque :' : 'Bank:'}</span>
                  <span className="font-bold">{BANK_DETAILS.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">
                    {isFR ? 'Nom du compte :' : 'Account Name:'}
                  </span>
                  <span className="font-bold text-right">{BANK_DETAILS.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-secondary font-bold">
                    {isFR ? 'Numéro de compte :' : 'Account Number:'}
                  </span>
                  <span className="font-bold text-lg tracking-wider">{BANK_DETAILS.number}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;