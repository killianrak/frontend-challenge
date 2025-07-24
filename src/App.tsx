import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Sidebar } from './components/Sidebar';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';

// Import des types et constantes
import type { Campaign, Profile } from './types/types';
import { createDefaultCampaign } from './constants/constants';

// Import des composants
import { Header } from './components/Header';
import { AlertsSection } from './components/AlertsSection';
import { ActionsSection } from './components/ActionsSection';
import { GameSelection } from './components/GameSelection';
import { GameCustomization } from './components/GameCustomization';
import { RewardsSection } from './components/RewardsSection';
import { ConditionsSection } from './components/ConditionsSection';
import { Modals } from './components/Modals';

// Thème Material-UI personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#ffffff', // Changé de #f5f5f5 à #ffffff
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '0 !important',
          '&:before': {
            display: 'none',
          },
          marginBottom: 0,
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
  },
});

function App() {
  // États locaux
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>("PREMIUM");
  const [allConditions, setAllConditions] = useState(false);
  const [minPurchase, setMinPurchase] = useState(false);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [winRate, setWinRate] = useState(false);
  const [pinCode, setPinCode] = useState<string>("");
  const [isPinConfigured, setIsPinConfigured] = useState<boolean>(false);

  // Configuration du formulaire
  const { control, handleSubmit, watch, setValue, getValues } = useForm<Campaign>({
    defaultValues: createDefaultCampaign(profile)
  });

  // Surveillance des changements
  const watchedGameType = watch("configuration.game_type");
  const watchedGifts = watch("configuration.gifts");
  const watchedPrimaryColor = watch("configuration.colors.primary");
  const watchedSecondaryColor = watch("configuration.colors.secondary");

  // Mise à jour du profil dans le formulaire
  useEffect(() => {
    setValue("profile", profile);
  }, [profile, setValue]);

  // Auto-ajout de perte si pas 100% gagnant
  useEffect(() => {
    // Obtenir les gifts actuels au moment de l'exécution
    const currentGifts = getValues("configuration.gifts") || [];
    
    if (!winRate) {
      const hasLoss = currentGifts.some(gift => gift.type === "LOSS");
      if (!hasLoss) {
        const newGifts = [
          ...currentGifts,
          {
            id: Date.now().toString(),
            icon: "❌",
            initial_limit: -1,
            limit: -1,
            name: "Perte",
            type: "LOSS" as const
          }
        ];
        setValue("configuration.gifts", newGifts);
      }
    } else {
      // Supprimer les pertes si 100% gagnant
      const giftsWithoutLoss = currentGifts.filter(gift => gift.type !== "LOSS");
      setValue("configuration.gifts", giftsWithoutLoss);
      
      // S'assurer qu'au moins un gain est illimité
      setTimeout(() => {
        const updatedGifts = getValues("configuration.gifts") || [];
        const hasUnlimited = updatedGifts.some(gift => gift.initial_limit === -1);
        
        if (!hasUnlimited && updatedGifts.length > 0) {
          const modifiedGifts = updatedGifts.map((gift, index) => {
            if (index === 0) {
              return {
                ...gift,
                initial_limit: -1,
                limit: -1
              };
            }
            return gift;
          });
          setValue("configuration.gifts", modifiedGifts);
        }
      }, 100);
    }
  }, [winRate, setValue, getValues]); // Supprimer watchedGifts des dépendances

  // Synchronisation des conditions avec les gains
  useEffect(() => {
    const currentConditions = getValues("configuration.retrievalConditions");
    const gifts = getValues("configuration.gifts");
    
    if (!gifts) return;

    // Supprimer les conditions pour les gains qui n'existent plus
    const validConditions = currentConditions.filter(condition =>
      gifts.some(gift => gift.name === condition.name)
    );

    // Ajouter des conditions pour les nouveaux gains
    gifts.forEach(gift => {
      if (!validConditions.some(condition => condition.name === gift.name)) {
        validConditions.push({
          id: Date.now().toString() + Math.random(),
          name: gift.name,
          value: allConditions ? "Pour tous les gains" : "Aucune"
        });
      }
    });

    setValue("configuration.retrievalConditions", validConditions);
  }, [watchedGifts, allConditions, setValue, getValues]);

  // Gestionnaires d'événements
  const onSubmit = (data: Campaign) => {
    console.log("Sauvegarde des données:", data);
    alert("Campagne sauvegardée avec succès!");
  };

  const handleOpenModal = (modalType: string) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handlePinConfigured = (pin: string) => {
    console.log('PIN configuré:', pin); // Debug
    setPinCode(pin);
    setIsPinConfigured(true);
    setOpenModal(null);
  };

  const handlePinClick = () => {
    if (!isPinConfigured) {
      // Si pas de PIN, ouvrir la modal de configuration
      setOpenModal('configure-pin');
    }
    // Si le PIN est configuré, on ne fait rien (le PIN est déjà affiché dans le bouton)
  };

return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Contenu principal */}
        <Box 
          sx={{ 
            flex: 1, 
            ml: '280px', // Largeur de la sidebar
            bgcolor: '#ffffff', // Changé de #f5f5f5 à #ffffff
            minHeight: '100vh'
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            {/* En-tête */}
            <Header
              onPinClick={handlePinClick}
              onQrClick={() => handleOpenModal('qr')}
              onSave={handleSubmit(onSubmit)}
              isPinConfigured={isPinConfigured}
              pinCode={pinCode}
            />

            <Box sx={{ p: 3 }}>
              {/* Formulaire principal */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Section des alertes */}
                <AlertsSection
                  isPinConfigured={isPinConfigured}
                  onConfigurePin={() => setOpenModal('configure-pin')}
                />

                {/* Section des actions */}
                <ActionsSection control={control} />

                {/* Sélection du jeu */}
                <GameSelection control={control} profile={profile} />

                {/* Personnalisation du jeu */}
                <GameCustomization
                  control={control}
                  profile={profile}
                  onPreview={() => handleOpenModal('preview')}
                />

                {/* Configuration des récompenses */}
                <RewardsSection
                  control={control}
                  winRate={winRate}
                  onWinRateChange={setWinRate}
                />

                {/* Conditions de récupération */}
                <ConditionsSection
                  control={control}
                  allConditions={allConditions}
                  onAllConditionsChange={setAllConditions}
                  minPurchase={minPurchase}
                  onMinPurchaseChange={setMinPurchase}
                  minPurchaseAmount={minPurchaseAmount}
                  onMinPurchaseAmountChange={setMinPurchaseAmount}
                  onEditCondition={() => handleOpenModal('edit-condition')}
                />
              </form>

              {/* Modales */}
              <Modals
                openModal={openModal}
                onCloseModal={handleCloseModal}
                onPinConfigured={handlePinConfigured}
                watchedGameType={watchedGameType}
                primaryColor={watchedPrimaryColor}
                secondaryColor={watchedSecondaryColor}
        
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;