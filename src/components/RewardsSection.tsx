import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  IconButton,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Casino as CasinoIcon,
  Restaurant as EatIcon,
  LocalDrink as DrinkIcon,
  Percent as DiscountIcon,
  Shuffle as ShuffleIcon,
  ConfirmationNumberOutlined
} from '@mui/icons-material';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { Campaign, GiftType } from '../types/types';
import { GIFT_CATEGORIES } from '../constants/constants';

interface RewardsSectionProps {
  control: Control<Campaign>;
  winRate: boolean;
  onWinRateChange: (value: boolean) => void;
}

const getGiftIcon = (type: GiftType) => {
  switch (type) {
    case "EAT": return <EatIcon sx={{ color: '#4285F4', fontSize: 20 }} />;
    case "DRINK": return <DrinkIcon sx={{ color: '#4285F4', fontSize: 20 }} />;
    case "DISCOUNT": return <DiscountIcon sx={{ color: '#4285F4', fontSize: 20 }} />;
    case "LOSS": return <CasinoIcon sx={{ color: '#4285F4', fontSize: 20 }} />;
    default: return <EatIcon sx={{ color: '#4285F4', fontSize: 20 }} />;
  }
};

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  control,
  winRate,
  onWinRateChange
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [prevWinRate, setPrevWinRate] = useState<boolean>(winRate);

  const { fields: giftFields, append: appendGift, remove: removeGift, update } = useFieldArray({
    control,
    name: "configuration.gifts"
  });

  // Surveiller les changements dans les gifts pour la validation
  const watchedGifts = useWatch({
    control,
    name: "configuration.gifts"
  });

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleAddGift = () => {
    appendGift({
      id: Date.now().toString(),
      icon: "🎁",
      initial_limit: 1,
      limit: 1,
      name: "",
      type: "EAT"
    });
  };

  const handleRandomDraw = () => {
    // Logique pour lancer le tirage au sort (non implémentée)
    console.log("Lancement du tirage au sort");
  };

  const handleWinRateChange = (checked: boolean) => {
    onWinRateChange(checked);
  };

  const handleRemoveGift = (index: number) => {
    try {
      const gift = giftFields[index];

      // Empêcher la suppression des pertes automatiques
      if (gift.type === "LOSS") {
        return;
      }

      // Empêcher la suppression si c'est le seul gain illimité en mode 100% gagnant
      if (winRate && gift.initial_limit === -1) {
        const unlimitedCount = giftFields.filter(g => g.type !== "LOSS" && g.initial_limit === -1).length;
        if (unlimitedCount <= 1) {
          alert("Au moins un gain doit être illimité en mode 100% gagnant");
          return;
        }
      }

      removeGift(index);
    } catch (error) {
      console.error('Erreur lors de la suppression du gift:', error);
    }
  };

  const handleLimitChange = (index: number, isUnlimited: boolean) => {
    try {
      const newLimit = isUnlimited ? -1 : 1;
      const gift = giftFields[index];

      // Vérifier la contrainte du jeu 100% gagnant
      if (winRate && !isUnlimited && gift.initial_limit === -1) {
        const unlimitedCount = giftFields.filter(g => g.type !== "LOSS" && g.initial_limit === -1).length;
        if (unlimitedCount <= 1) {
          alert("Au moins un gain doit être illimité en mode 100% gagnant");
          return;
        }
      }

      update(index, {
        ...gift,
        initial_limit: newLimit,
        limit: newLimit
      });
    } catch (error) {
      console.error('Erreur lors du changement de limite:', error);
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
              AJOUTEZ ET CONFIGUREZ VOS GAINS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
              Indiquez les récompenses que vos clients pourront gagner. Offrez des cadeaux attractifs pour augmenter leur engagement et leur fidélité.
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 1 }}>
        {/* En-tête avec options et boutons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: '#FF9800',
                  borderRadius: 1
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                Jeu 100% Gagnant
              </Typography>
              <Switch
                checked={winRate}
                onChange={(e) => handleWinRateChange(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FF9800',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FF9800',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              endIcon={<ConfirmationNumberOutlined />}
              onClick={handleRandomDraw}
              sx={{
                bgcolor: '#FF9800',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: '#F57C00' }
              }}
            >
              Lancer le tirage au sort
            </Button>

            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={handleAddGift}
              sx={{
                bgcolor: '#4285F4',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: '#3367d6' }
              }}
            >
              Ajouter un gain
            </Button>
          </Box>
        </Box>

        {/* Messages informatifs */}
        {!winRate && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffcc02' }}>
            <Typography variant="body2" sx={{ color: '#e65100' }}>
              Une case 'Perdu' a été automatiquement ajoutée au jeu. Activez le mode 100% gagnant pour la supprimer.
            </Typography>
          </Box>
        )}

        {winRate && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
              Mode 100% gagnant activé : tous les joueurs remporteront un prix. Au moins un gain doit être en quantité illimitée.
            </Typography>
          </Box>
        )}

        {/* En-têtes des colonnes */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                Nom du Gain
              </Typography>
              <Box sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#6b7280' }}>
                  i
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                Catégorie
              </Typography>
              <Box sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#6b7280' }}>
                  i
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                Nombre de stock
              </Typography>
              <Box sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#6b7280' }}>
                  i
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 2 }}>
            {/* Colonne vide pour les actions */}
          </Grid>
        </Grid>

        {/* Liste des gains */}
        {giftFields.map((gift, index) => (
          <Paper key={gift.id} elevation={0} sx={{ mb: 1, border: '1px solid #f3f4f6', borderRadius: 1 }}>
            <Grid container spacing={2} sx={{ p: 1.5, alignItems: 'center' }}>
              {/* Nom du gain */}
              <Grid size={{ xs: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Controller
                    name={`configuration.gifts.${index}.type`}
                    control={control}
                    render={({ field }) => getGiftIcon(field.value)}
                  />
                  <Controller
                    name={`configuration.gifts.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder={gift.type === "LOSS" ? "Perte" : "Nom du gain"}
                        disabled={gift.type === "LOSS"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            fontSize: '14px',
                            '& input': {
                              fontWeight: 500,
                              padding: '8px 12px'
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              {/* Catégorie */}
              <Grid size={{ xs: 3 }}>
                <Controller
                  name={`configuration.gifts.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        variant="outlined"
                        size="small"
                        disabled={gift.type === "LOSS"}
                        sx={{
                          borderRadius: 1,
                          fontSize: '14px',
                          '& .MuiSelect-select': {
                            padding: '8px 12px'
                          }
                        }}
                      >
                        {GIFT_CATEGORIES.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Nombre de stock */}
              <Grid size={{ xs: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Controller
                    name={`configuration.gifts.${index}.limit`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        variant="outlined"
                        size="small"
                        value={field.value === -1 ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? -1 : parseInt(e.target.value) || 0;
                          field.onChange(value);
                        }}
                        placeholder={field.value === -1 ? "Illimité" : "15"}
                        disabled={field.value === -1}
                        sx={{
                          width: '70px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            fontSize: '14px',
                            '& input': {
                              padding: '8px 8px',
                              textAlign: 'center'
                            }
                          }
                        }}
                      />
                    )}
                  />

                  <Typography variant="body2" sx={{
                    color: '#9ca3af',
                    fontSize: '13px',
                    minWidth: '50px'
                  }}>
                    Illimité
                  </Typography>

                  <Switch
                    checked={gift.limit === -1}
                    onChange={(e) => handleLimitChange(index, e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4285F4',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4285F4',
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Actions */}
              <Grid size={{ xs: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => handleRemoveGift(index)}
                    disabled={gift.type === "LOSS"}
                    size="small"
                    sx={{
                      color: gift.type === "LOSS" ? '#d1d5db' : '#ef4444',
                      '&:hover': {
                        bgcolor: gift.type === "LOSS" ? 'transparent' : '#fee2e2'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Bouton ajouter un gain */}
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddGift}
          sx={{
            color: '#4285F4',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            mt: 1,
            '&:hover': {
              bgcolor: '#f8fafc'
            }
          }}
        >
          Ajouter un Troisième Gain
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};