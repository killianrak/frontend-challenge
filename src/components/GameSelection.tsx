import React, { useState } from 'react';
import {
    Typography,
    Chip,
    Grid,
    Box,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { Campaign, Profile, GameType } from '../types/types';
import wheel from "../assets/wheel.jpg";
import slot from "../assets/slot.png";
import mystery from "../assets/mystery.png";
import card from "../assets/card.png";
import {
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

interface GameSelectionProps {
    control: Control<Campaign>;
    profile: Profile;
}

// Configuration des types de jeux avec images
const GAME_CONFIGS: Record<GameType, {
    color: string;
    isPremium: boolean;
    image: string;
}> = {
    WHEEL: {
        color: '#4285F4',
        isPremium: false,
        image: wheel
    },
    MYSTERY: {
        color: '#FF9800',
        isPremium: true,
        image: mystery
    },
    SLOT_MACHINE: {
        color: '#9C27B0',
        isPremium: true,
        image: slot
    },
    CARD: {
        color: '#2196F3',
        isPremium: true,
        image: card
    }
};

export const GameSelection: React.FC<GameSelectionProps> = ({ control, profile }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return (
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{
                        width: 4,
                        height: 60,
                        backgroundColor: '#4285F4',
                        borderRadius: 1,
                        mr: 2
                    }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', mb: 1 }}>
                            CHOIX DU JEU
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                            Sélectionnez parmi 4 jeux interactifs pour engager vos utilisateurs et créer une expérience unique.
                        </Typography>
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 3 }}>
                {/* Sélection du type de jeu */}
                <Controller

                    name="configuration.game_type"

                    control={control}

                    render={({ field }) => (

                        <Grid container spacing={3}>

                            {Object.entries(GAME_CONFIGS).map(([gameType, config]) => {

                                const isDisabled = profile === "BASIC" && config.isPremium;

                                const isSelected = field.value === gameType;

                                return (

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={gameType}>

                                        <Paper

                                            onClick={() => {

                                                if (!isDisabled) {

                                                    field.onChange(gameType as GameType);

                                                }

                                            }}

                                            sx={{

                                                '&:hover': {

                                                    borderColor: isDisabled ? '#e5e7eb' : config.color,

                                                    transform: isDisabled ? 'none' : 'translateY(-4px)',

                                                    boxShadow: isDisabled ? 'none' : '0 12px 30px rgba(0,0,0,0.15)'

                                                }

                                            }}

                                        >

                                            <img

                                                src={config.image}

                                                alt={`Jeu ${gameType}`}

                                                style={{

                                                    width: '100%',

                                                    height: '100%',

                                                    objectFit: 'cover',

                                                    borderRadius: 7,

                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',

                                                    border: isSelected ? `4px solid ${config.color}` : '3px solid #e5e7eb',

                                            transition: 'all 0.3s ease',

                                            display: 'flex',

                                            flexDirection: 'column',

                                            position: 'relative',

                                            opacity: isDisabled ? 0.6 : 1,

 }}

/>

                                        </Paper>

                                    </Grid>

                                );

                            })}

                        </Grid>

                    )}

                />

                {/* Message pour profil Basic */}
                {profile === "BASIC" && (
                    <Box sx={{
                        mt: 3,
                        p: 3,
                        backgroundColor: '#fef3cd',
                        borderRadius: 3,
                        border: '1px solid #fbbf24'
                    }}>
                        <Typography variant="body2" sx={{ color: '#92400e', fontSize: '14px', textAlign: 'center' }}>
                            ⚠️ Passez au profil Premium pour débloquer tous les types de jeux
                        </Typography>
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};