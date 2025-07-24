import React, { useState, useRef } from 'react';
import {
    Typography,
    Button,
    TextField,
    Grid,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Visibility as PreviewIcon,
    UploadRounded
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { Campaign, Profile } from '../types/types';

interface GameCustomizationProps {
    control: Control<Campaign>;
    profile: Profile;
    onPreview: () => void;
}

export const GameCustomization: React.FC<GameCustomizationProps> = ({
    control,
    profile,
    onPreview
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const primaryColorInputRef = useRef<HTMLInputElement>(null);
    const secondaryColorInputRef = useRef<HTMLInputElement>(null);

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    const validateHexColor = (value: string): string | true => {
        if (!value) return true; // Allow empty values
        return /^#[0-9A-F]{6}$/i.test(value) || "Format hexadécimal requis (#RRGGBB)";
    };

    const isValidHexColor = (color: string): boolean => {
        return /^#[0-9A-F]{6}$/i.test(color);
    };

    const handleColorClick = (colorType: 'primary' | 'secondary') => {
        if (profile === "BASIC") return;
        
        if (colorType === 'primary') {
            primaryColorInputRef.current?.click();
        } else {
            secondaryColorInputRef.current?.click();
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log("Fichier déposé:", e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log("Fichier sélectionné:", e.target.files[0]);
        }
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
                            PERSONNALISEZ VOTRE JEU
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                            Importez votre logo et sélectionnez vos couleurs pour créer un jeu à l'image de votre marque. Offrez à vos clients une expérience unique, entièrement personnalisée.
                        </Typography>
                    </Box>
                </Box>
            </AccordionSummary>
            
            <AccordionDetails sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 1 }}>
                <Grid container spacing={6}>
                    {/* Section Upload Logo */}
                    <Grid size={{xs: 12, md: 6}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    bgcolor: '#4285F4',
                                    borderRadius: 1
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                                Glissez-déposez votre logo
                            </Typography>
                        </Box>

                        <Paper
                            elevation={0}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            sx={{
                                border: `2px dashed ${dragActive ? '#4285F4' : '#d1d5db'}`,
                                borderRadius: 2,
                                p: 6,
                                textAlign: 'center',
                                bgcolor: dragActive ? '#f8fafc' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: '#4285F4',
                                    bgcolor: '#f8fafc'
                                }
                            }}
                            onClick={handleFileSelect}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}
                            >
                                <UploadRounded sx={{color: "white"}}/>
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#6b7280',
                                    mb: 3,
                                    fontSize: '16px'
                                }}
                            >
                                Cliquez ou glissez-déposez votre fichier
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#4285F4',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '14px',
                                    borderRadius: 1,
                                    '&:hover': { bgcolor: '#3367d6' }
                                }}
                            >
                                SÉLECTIONNER UN FICHIER
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </Paper>
                    </Grid>

                    {/* Section Couleurs */}
                    <Grid size={{xs: 12, md: 6}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 24,
                                        bgcolor: '#4285F4',
                                        borderRadius: 1
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                                    Importer vos couleurs
                                </Typography>
                            </Box>

                            <Button
                                variant="text"
                                startIcon={<PreviewIcon />}
                                onClick={onPreview}
                                sx={{
                                    color: '#4285F4',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    '&:hover': {
                                        bgcolor: '#f8fafc'
                                    }
                                }}
                            >
                                Voir l'aperçu
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
                            {/* Couleur Primaire */}
                            <Controller
                                name="configuration.colors.primary"
                                control={control}
                                rules={{ validate: validateHexColor }}
                                render={({ field, fieldState }) => (
                                    <Box sx={{ flex: 'none', width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box
                                            onClick={() => handleColorClick('primary')}
                                            sx={{
                                                width: 72,
                                                height: 200,
                                                bgcolor: isValidHexColor(field.value) ? field.value : '#4285F4',
                                                borderRadius: 25,
                                                border: '1px solid #e5e7eb',
                                                mb: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                cursor: profile === "BASIC" ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': profile !== "BASIC" ? {
                                                    transform: 'scale(1.02)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                                                } : {}
                                            }}
                                        />
                                        <input
                                            ref={primaryColorInputRef}
                                            type="color"
                                            value={isValidHexColor(field.value) ? field.value : '#4285F4'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            style={{ display: 'none' }}
                                            disabled={profile === "BASIC"}
                                        />
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="#4285F4"
                                            disabled={profile === "BASIC"}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            onChange={(e) => {
                                                const value = e.target.value.toUpperCase();
                                                field.onChange(value);
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    '& input': {
                                                        textAlign: 'center',
                                                        fontFamily: 'monospace',
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        color: '#374151'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            />

                            {/* Couleur Secondaire */}
                            <Controller
                                name="configuration.colors.secondary"
                                control={control}
                                rules={{ validate: validateHexColor }}
                                render={({ field, fieldState }) => (
                                    <Box sx={{ flex: 'none', width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box
                                            onClick={() => handleColorClick('secondary')}
                                            sx={{
                                                width: 72,
                                                height: 200,
                                                bgcolor: isValidHexColor(field.value) ? field.value : '#FF9800',
                                                borderRadius: 25,
                                                border: '1px solid #e5e7eb',
                                                mb: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                cursor: profile === "BASIC" ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': profile !== "BASIC" ? {
                                                    transform: 'scale(1.02)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                                                } : {}
                                            }}
                                        />
                                        <input
                                            ref={secondaryColorInputRef}
                                            type="color"
                                            value={isValidHexColor(field.value) ? field.value : '#FF9800'}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            style={{ display: 'none' }}
                                            disabled={profile === "BASIC"}
                                        />
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="#FF9800"
                                            disabled={profile === "BASIC"}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            onChange={(e) => {
                                                const value = e.target.value.toUpperCase();
                                                field.onChange(value);
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    '& input': {
                                                        textAlign: 'center',
                                                        fontFamily: 'monospace',
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        color: '#374151'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#9ca3af',
                                fontSize: '14px',
                                textAlign: 'center',
                                lineHeight: 1.5
                            }}
                        >
                            Personnalisez votre jeu en ajoutant jusqu'à deux couleurs
                        </Typography>

                        {profile === "BASIC" && (
                            <Box sx={{
                                mt: 3,
                                p: 3,
                                bgcolor: '#fef3cd',
                                borderRadius: 2,
                                border: '1px solid #fbbf24'
                            }}>
                                <Typography variant="body2" sx={{ color: '#92400e', fontSize: '14px', textAlign: 'center' }}>
                                    ⚠️ La personnalisation des couleurs nécessite un profil Premium.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};