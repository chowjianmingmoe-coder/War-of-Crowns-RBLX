import React, { useState } from 'react';
import { AuthProvider } from './utils/authContext';
import { AnnouncementsProvider } from './utils/announcementsContext';
import { SupportProvider } from './utils/supportContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MediaGallery } from './components/MediaGallery';
import { CommunitySection } from './components/CommunitySection';
import { AnnouncementsPage } from './components/AnnouncementsPage';
import { CustomerSupportPage } from './components/CustomerSupportPage';
import { Footer } from './components/Footer';
import { TrailerModal } from './components/TrailerModal';
import { AuthModal } from './components/AuthModal';
import { ModeratorPortalModal } from './components/ModeratorPortalModal';
import { CommanderDossierModal } from './components/CommanderDossierModal';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'announcements' | 'support'>('home');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isModeratorPortalOpen, setIsModeratorPortalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] flex flex-col selection:bg-amber-600/40 selection:text-amber-100 font-sans">
      {/* Top Fixed Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTrailer={() => setIsTrailerOpen(true)}
        onOpenModeratorPortal={() => setIsModeratorPortalOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <HeroSection
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenTrailer={() => setIsTrailerOpen(true)}
              onNavigate={(page) => setCurrentPage(page)}
            />
            <MediaGallery />
            <CommunitySection />
          </>
        )}

        {currentPage === 'announcements' && (
          <AnnouncementsPage
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentPage === 'support' && (
          <CustomerSupportPage
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(page) => setCurrentPage(page)} />

      {/* Cinematic Teaser Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />

      {/* Commander Login Modal (Moderator-Provisioned Only) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenModeratorPortal={() => setIsModeratorPortalOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* Moderator Command Portal (For Provisioning & Managing Users) */}
      <ModeratorPortalModal
        isOpen={isModeratorPortalOpen}
        onClose={() => setIsModeratorPortalOpen(false)}
      />

      {/* Commander War Room Dossier & Roblox Experience Access */}
      <CommanderDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onOpenModeratorPortal={() => setIsModeratorPortalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnnouncementsProvider>
        <SupportProvider>
          <AppContent />
        </SupportProvider>
      </AnnouncementsProvider>
    </AuthProvider>
  );
}

