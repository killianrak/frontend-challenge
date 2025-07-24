import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { Campaign } from '../types/types';

interface ConditionsSectionProps {
  control: Control<Campaign>;
  allConditions: boolean;
  onAllConditionsChange: (value: boolean) => void;
  minPurchase: boolean;
  onMinPurchaseChange: (value: boolean) => void;
  minPurchaseAmount: string;
  onMinPurchaseAmountChange: (value: string) => void;
  onEditCondition: () => void;
}

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({
  control,
  allConditions,
  onAllConditionsChange,
  minPurchase,
  onMinPurchaseChange,
  minPurchaseAmount,
  onMinPurchaseAmountChange,
  onEditCondition
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { fields: conditionFields, update: updateCondition, replace: replaceConditions } = useFieldArray({
    control,
    name: "configuration.retrievalConditions"
  });

  // Surveiller les changements dans les gifts
  const watchedGifts = useWatch({
    control,
    name: "configuration.gifts"
  });

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Synchroniser les conditions avec les gifts
  useEffect(() => {
    if (!watchedGifts) return;

    const newConditions: any[] = [];

    // Créer une condition pour chaque gift
    watchedGifts.forEach(gift => {
      const existingCondition = conditionFields.find(condition => condition.name === gift.name);
      
      let conditionValue = "Aucune";
      if (minPurchase) {
        // Si l'achat minimal est activé, c'est pour tous les gains
        conditionValue = `Achat minimum de ${minPurchaseAmount || 0}€`;
      }

      newConditions.push({
        id: existingCondition?.id || `condition_${gift.id}_${Date.now()}`,
        name: gift.name || gift.type,
        value: conditionValue
      });
    });

    // Mettre à jour seulement si les conditions ont changé
    const conditionsChanged = 
      newConditions.length !== conditionFields.length ||
      newConditions.some((newCond, index) => {
        const existingCond = conditionFields[index];
        return !existingCond || 
               newCond.name !== existingCond.name || 
               newCond.value !== existingCond.value;
      });

    if (conditionsChanged) {
      replaceConditions(newConditions);
    }
  }, [watchedGifts, minPurchase, minPurchaseAmount, conditionFields, replaceConditions]);

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
              DÉFINISSEZ LES CONDITIONS POUR RÉCUPÉRER LES CADEAUX
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
              Paramétrez si vos clients doivent remplir une condition (ex: montant minimum d'achat) pour pouvoir récupérer leur cadeau.
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, mt: 1 }}>
        {/* Section des conditions */}
        <Box sx={{ mb: 4 }}>
          {/* Pas de condition */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: '#d1d5db',
                  borderRadius: 1
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000', mb: 0.5 }}>
                  Pas de condition
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  Les clients peuvent récupérer leur gain sans aucun achat.
                </Typography>
              </Box>
              <Switch
                checked={!minPurchase}
                onChange={(e) => onMinPurchaseChange(!e.target.checked)}
                sx={{
                  ml: 2,
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#d1d5db',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#d1d5db',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Sous condition d'achat minimale */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: '#ff9800',
                  borderRadius: 1,
                  mt: 0.5
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000', mb: 0.5 }}>
                  Sous condition d'achat minimale
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 2 }}>
                  Exigez un montant minimum d'achat en boutique pour permettre la récupération du gain.
                </Typography>
                
                {minPurchase && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500 }}>
                      Montant à atteindre
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Ex : 10€ d'achat minimum pour récupérer le gain"
                      type="number"
                      value={minPurchaseAmount}
                      onChange={(e) => onMinPurchaseAmountChange(e.target.value)}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: '#666' }}>€</Typography>
                      }}
                      sx={{ 
                        width: '100%',
                        maxWidth: 400,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          fontSize: '14px',
                          '& input': {
                            padding: '8px 12px'
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Switch
                checked={minPurchase}
                onChange={(e) => onMinPurchaseChange(e.target.checked)}
                sx={{
                  ml: 2,
                  mt: 0.5,
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#ff9800',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#ff9800',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Tableau des conditions par gain */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', mb: 1 }}>
            Conditions par gain
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Personnalisez les conditions pour chaque gain individuellement ou utilisez la condition globale ci-dessus.
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Gain</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Condition appliquée</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conditionFields.map((field, index) => (
                <TableRow key={field.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {field.name || 'Gain sans nom'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: field.value === "Aucune" ? '#f3f4f6' : '#fff8f0',
                      color: field.value === "Aucune" ? '#6b7280' : '#ea580c',
                      border: field.value === "Aucune" ? '1px solid #d1d5db' : '1px solid #fed7aa',
                      display: 'inline-block',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                      {field.value}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {field.value !== "Aucune" ? (
                      <Button
                        variant="text"
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={onEditCondition}
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
                        Modifier
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={onEditCondition}
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
                        Ajouter une condition
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {conditionFields.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: '#6b7280' }}>
                    Aucun gain configuré. Ajoutez des gains pour définir leurs conditions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};