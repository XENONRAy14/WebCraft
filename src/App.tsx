import React, { useEffect, useRef, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Users, Rocket, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { emailConfig } from './config';

type TeamMemberProps = {
  src: string;
  alt: string;
  name: string;
  role: string;
  delay?: string;
  children?: React.ReactNode;
};

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
};

type TestimonialProps = {
  name: string;
  role: string;
  content: string;
  rating: number;
  delay?: string;
};

type ProjectProps = {
  image: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  delay?: string;
};

type PricingTierProps = {
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
  delay?: string;
};

interface SmartFormProps {
  selectedPlan: string;
  onClose: () => void;
}

const SmartForm: React.FC<SmartFormProps> = ({ selectedPlan, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    message: '',
    plan: selectedPlan
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          to_name: 'Admin',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          company: formData.company,
          plan: formData.plan,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message
        },
        emailConfig.publicKey
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Demande envoyée !</h3>
          <p className="text-gray-600">Nous vous contacterons très bientôt.</p>
        </motion.div>
      ) : submitStatus === 'error' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mb-4 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Une erreur est survenue</h3>
          <p className="text-gray-600 mb-4">Veuillez réessayer ou nous contacter directement.</p>
          <button
            type="button"
            onClick={() => setSubmitStatus('idle')}
            className="text-blue-600 hover:text-blue-700"
          >
            Réessayer
          </button>
        </motion.div>
      ) : (
        <>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise (optionnel)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Délai souhaité</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un délai</option>
                  <option value="urgent">{"Urgent (moins d'1 mois)"}</option>
                  <option value="normal">Normal (1-3 mois)</option>
                  <option value="flexible">Flexible (plus de 3 mois)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  placeholder="Décrivez votre projet..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-1/2 py-3 px-6 rounded-lg transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </form>
  );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TeamMember: React.FC<TeamMemberProps> = ({ src, alt, name, role, delay, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay ? parseFloat(delay) : 0 }}
      className="relative p-4 sm:p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative mb-4 sm:mb-6 mx-auto w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48">
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full"
        />
        {children}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{name}</h3>
      <p className="text-sm sm:text-base text-gray-600">{role}</p>
    </motion.div>
  );
};

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-lg animate-on-scroll"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, rating, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-lg animate-on-scroll"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl mr-1">★</span>
        ))}
      </div>
      <p className="text-gray-600 mb-4">{content}</p>
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<ProjectProps> = ({ image, title, description, technologies, link, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay ? parseFloat(delay) : 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative group h-64">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        {link && (
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir le projet <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const PricingTier: React.FC<PricingTierProps> = ({ name, description, features, recommended, delay }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay ? parseFloat(delay) : 0 }}
        className={`relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow ${recommended ? 'border-2 border-blue-500' : ''}`}
      >
        {recommended && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Recommandé</span>
          </div>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${recommended ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {name === "Site Vitrine" && (
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {name === "E-commerce" && (
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
            {name === "Sur Mesure" && (
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-center">{name}</h3>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full py-3 px-6 rounded-lg transition-colors ${
            recommended 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Demander un devis
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Devis pour {name}</h3>
              <p className="text-gray-600">Remplissez ce formulaire pour recevoir une proposition détaillée.</p>
            </div>
            <SmartForm
              selectedPlan={name}
              onClose={() => setIsModalOpen(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Afficher un message de chargement
    const submitButton = formRef.current.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.innerText;
    submitButton.innerText = 'Envoi en cours...';
    submitButton.disabled = true;

    emailjs.sendForm(
      emailConfig.serviceId,
      emailConfig.templateId,
      formRef.current,
      emailConfig.publicKey
    )
      .then((result) => {
        console.log('Email envoyé avec succès:', result.text);
        submitButton.innerText = 'Envoyé !';
        submitButton.className += ' bg-green-600';
        formRef.current?.reset();
        
        // Réinitialiser le bouton après 3 secondes
        setTimeout(() => {
          submitButton.innerText = originalText;
          submitButton.disabled = false;
          submitButton.className = submitButton.className.replace(' bg-green-600', '');
        }, 3000);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        submitButton.innerText = 'Erreur !';
        submitButton.className += ' bg-red-600';
        
        // Réinitialiser le bouton après 3 secondes
        setTimeout(() => {
          submitButton.innerText = originalText;
          submitButton.disabled = false;
          submitButton.className = submitButton.className.replace(' bg-red-600', '');
        }, 3000);
      });
  };

  const services: ServiceCardProps[] = [
    {
      icon: <Code2 size={32} />,
      title: "Développement Web",
      description: "Création de sites web modernes et réactifs avec les dernières technologies.",
      delay: "100ms"
    },
    {
      icon: <Users size={32} />,
      title: "Gestion de Projet",
      description: "Accompagnement et suivi de projets web de A à Z.",
      delay: "200ms"
    },
    {
      icon: <Rocket size={32} />,
      title: "Optimisation",
      description: "Amélioration des performances et de l'expérience utilisateur.",
      delay: "300ms"
    }
  ];

  const testimonials: TestimonialProps[] = [
    {
      name: "Omar",
      role: "CEO, BMConduite",
      content: "Une expérience simple et rapide  ! L'équipe a su transformer notre vision en réalité.",
      rating: 5,
      delay: "100ms"
    },
    {
      name: "Dounia",
      role: "Directrice Dounia Shop",
      content: "les délais ont été respecter , l'equipe a su répondre a mes attentes",
      rating: 5,
      delay: "200ms"
    },
    {
      name: "Marc",
      role: "FlexDrive",
      content: "réalisation d'un site web qui gère la vente , et cela a moindre cout",
      rating: 5,
      delay: "300ms"
    }
  ];

  const projects: ProjectProps[] = [
    {
      image: "/images/bmconduite.jpg",
      title: "BM Conduite",
      description: "Site web moderne pour une auto-école, avec système de géolocalisation et prise de contact intégrée. Design élégant avec une identité visuelle forte.",
      technologies: ["React", "TypeScript", "Google Maps API", "TailwindCSS"],
      delay: "0.1s"
    },
    {
      image: "/images/bydounia.jpg",
      title: "Dounia Shop",
      description: "Boutique en ligne pour une marque de vêtements, avec gestion des stocks et paiements sécurisés.",
      technologies: ["Next.js", "Stripe", "MongoDB"],
      delay: "0.2s"
    },
    {
      image: "/images/flexdrive.jpg",
      title: "FlexDrive",
      description: "Application de location de voitures avec système de réservation et paiement intégré.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      delay: "0.3s"
    }
  ];

  const pricingTiers: PricingTierProps[] = [
    {
      name: "Site Vitrine",
      description: "Parfait pour les petites entreprises qui souhaitent établir leur présence en ligne.",
      features: [
        "Design personnalisé",
        "Responsive (mobile-first)",
        "Jusqu'à 5 pages",
        "Formulaire de contact",
        "Optimisation SEO de base",
        "Hébergement inclus (1 an)"
      ],
      delay: "0.1s"
    },
    {
      name: "E-commerce",
      description: "Solution complète pour vendre vos produits en ligne.",
      features: [
        "Tout du pack Site Vitrine",
        "Catalogue de produits",
        "Système de paiement sécurisé",
        "Gestion des stocks",
        "Panel d'administration",
        "Formation incluse"
      ],
      recommended: true,
      delay: "0.2s"
    },
    {
      name: "Sur Mesure",
      description: "Pour les projets complexes nécessitant des fonctionnalités spécifiques.",
      features: [
        "Analyse des besoins",
        "Architecture sur mesure",
        "Fonctionnalités avancées",
        "API personnalisée",
        "Support prioritaire",
        "Maintenance évolutive"
      ],
      delay: "0.3s"
    }
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.classList.add('slide-in');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll<HTMLElement>('.animate-on-scroll');
    elements.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Admin Button */}
      <div className="fixed top-4 right-4 z-50">
        <Link 
          to="/admin/login"
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors shadow-lg"
        >
          Admin
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
          <div className="absolute -inset-[10px] bg-grid-white/5 bg-grid-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300 px-4"
            >
              Votre Site Web Sur Mesure
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            >
              Nous créons des sites web professionnels qui reflètent l'identité de votre entreprise. De la conception à la mise en ligne, nous vous accompagnons dans votre transformation digitale.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 px-4"
            >
              <a 
                href="#contact" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-300 transform hover:scale-105 text-center"
              >
                Demander un devis
              </a>
              <a 
                href="#portfolio" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 transform hover:scale-105 text-center"
              >
                Nos réalisations
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Nos Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des solutions innovantes adaptées à vos ambitions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {services.map((service, index) => (
              <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} delay={service.delay} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 sm:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Notre Équipe
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4"
            >
              Une équipe passionnée qui combine expertise technique et créativité pour donner vie à vos projets web.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <TeamMember
              src="/images/avatar-geometric-1.svg"
              alt="Rayan Belhocine"
              name="Rayan Belhocine"
              role="Directeur & Développeur"
              delay="0.1s"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-full" />
            </TeamMember>

            <TeamMember
              src="/images/avatar-geometric-2.svg"
              alt="Tadj eddine Benamar"
              name="Tadj eddine Benamar"
              role="Développeur Web"
              delay="0.2s"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-full" />
            </TeamMember>

            <TeamMember
              src="/images/avatar-geometric-3.svg"
              alt="Marc Kineider"
              name="Marc Kineider"
              role="Chef de Projet"
              delay="0.3s"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-full" />
            </TeamMember>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 relative bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Témoignages</h2>
              <p className="text-xl text-gray-600">
                Ce que disent nos clients
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {testimonials.map((testimonial, index) => (
                <Testimonial key={index} name={testimonial.name} role={testimonial.role} content={testimonial.content} rating={testimonial.rating} delay={testimonial.delay} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Nos Réalisations
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              Découvrez quelques-uns de nos projets récents et comment nous avons aidé nos clients à réussir en ligne.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Nos Solutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              Des solutions personnalisées pour répondre à vos besoins spécifiques. Contactez-nous pour un devis gratuit.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <PricingTier key={index} {...tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Contactez-nous</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une question ? Un projet ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gradient">Email</h3>
                  <p className="mt-1 text-gray-600">rayanbelho@hotmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gradient">Téléphone</h3>
                  <p className="mt-1 text-gray-600">+33651363192</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gradient">Adresse</h3>
                  <p className="mt-1 text-gray-600">Marseille, France</p>
                </div>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Votre message..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <Code2 className="h-10 w-10 text-blue-400" />
              <span className="text-2xl font-bold text-gradient">Webfly</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">&copy; 2024 Webfly. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;