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
  Edit as EditIcon
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

    const currentConditions = [...conditionFields];
    const newConditions: any[] = [];

    // Créer une condition pour chaque gift
    watchedGifts.forEach(gift => {
      const existingCondition = currentConditions.find(condition => condition.name === gift.name);
      
      let conditionValue = "Aucune";
      if (allConditions && minPurchase) {
        conditionValue = `Achat minimum de ${minPurchaseAmount || 0}€`;
      } else if (allConditions) {
        conditionValue = "Pour tous les gains";
      } else if (minPurchase) {
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
  }, [watchedGifts, allConditions, minPurchase, minPurchaseAmount, conditionFields, replaceConditions]);

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
        {/* Section des switches de configuration */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                Pour tous les gains
              </Typography>
              <Switch
                checked={allConditions}
                onChange={(e) => onAllConditionsChange(e.target.checked)}
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
          
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2, ml: 3 }}>
            Appliquer les mêmes conditions à tous les gains
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  bgcolor: '#4CAF50',
                  borderRadius: 1
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                Sous condition d'achat minimal
              </Typography>
              <Switch
                checked={minPurchase}
                onChange={(e) => onMinPurchaseChange(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#4CAF50',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4CAF50',
                  },
                }}
              />
            </Box>
          </Box>
          
          {minPurchase && (
            <Box sx={{ ml: 3, mt: 2 }}>
              <TextField
                size="small"
                label="Montant minimum"
                type="number"
                value={minPurchaseAmount}
                onChange={(e) => onMinPurchaseAmountChange(e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ color: '#666' }}>€</Typography>
                }}
                sx={{ 
                  width: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '14px',
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Messages informatifs */}
        {allConditions && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffcc02' }}>
            <Typography variant="body2" sx={{ color: '#e65100' }}>
              Les mêmes conditions s'appliquent à tous les gains.
            </Typography>
          </Box>
        )}

        {minPurchase && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
              Un achat minimum de {minPurchaseAmount || 0}€ est requis pour récupérer les gains.
            </Typography>
          </Box>
        )}

        {/* Tableau des conditions */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Gain</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Condition</TableCell>
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
                      bgcolor: field.value === "Aucune" ? '#f3f4f6' : '#e8f5e8',
                      color: field.value === "Aucune" ? '#6b7280' : '#2e7d32',
                      display: 'inline-block',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                      {field.value}
                    </Box>
                  </TableCell>
                  <TableCell>
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