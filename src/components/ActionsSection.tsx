import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Alert,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Warning as WarningIcon,
  Google as GoogleIcon,
  People as PeopleIcon,
  HelpOutline as HelpIcon,
  Close as CloseIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { Campaign, Action, ActionType } from '../types/types';

interface ActionsSectionProps {
  control: Control<Campaign>;
}

// Configuration des types d'actions basée sur ActionType
const ACTION_CONFIGS: Record<ActionType, {
  label: string;
  icon: React.ReactElement;
  color: string;
  description: string;
  hasTarget: boolean;
  targetPlaceholder?: string;
  isIntegrated?: boolean;
  urlRegex?: RegExp;
  errorMessage?: string;
}> = {
  GOOGLE_REVIEW: {
    label: 'Avis Google',
    icon: <GoogleIcon sx={{ fontSize: 20 }} />,
    color: '#4285F4',
    description: 'Demander un avis Google',
    hasTarget: true,
    targetPlaceholder: 'https://google.com/business/...',
    isIntegrated: true,
    urlRegex: /^https:\/\/(www\.)?(google\.(com|fr|de|es|it|nl|be|ch|ca|au)|maps\.google\.(com|fr|de|es|it|nl|be|ch|ca|au))\/.*$/,
    errorMessage: 'Veuillez saisir une URL Google valide (google.com ou maps.google.com)'
  },
  INSTAGRAM: {
    label: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 20 }} />,
    color: '#E4405F',
    description: 'Action Instagram (like, follow, story)',
    hasTarget: true,
    targetPlaceholder: 'https://instagram.com/votre_compte',
    isIntegrated: true,
    urlRegex: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
    errorMessage: 'Veuillez saisir une URL Instagram valide (instagram.com/nom_utilisateur)'
  },
  FACEBOOK: {
    label: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 20 }} />,
    color: '#1877F2',
    description: 'Action Facebook (like, partage)',
    hasTarget: true,
    targetPlaceholder: 'https://facebook.com/votre_page',
    isIntegrated: true,
    urlRegex: /^https:\/\/(www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9._-]+\/?$/,
    errorMessage: 'Veuillez saisir une URL Facebook valide (facebook.com/nom_page)'
  },
  TIKTOK: {
    label: 'TikTok',
    icon: (
      <Box
        sx={{
          width: 20,
          height: 20,
          background: 'linear-gradient(45deg, #ff0050, #00f2ea)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        T
      </Box>
    ),
    color: '#000000',
    description: 'Action TikTok (follow, like)',
    hasTarget: true,
    targetPlaceholder: 'https://tiktok.com/@votre_compte',
    isIntegrated: true,
    urlRegex: /^https:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._]+\/?$/,
    errorMessage: 'Veuillez saisir une URL TikTok valide (tiktok.com/@nom_utilisateur)'
  }
};

export const ActionsSection: React.FC<ActionsSectionProps> = ({ control }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newActionType, setNewActionType] = useState<ActionType>('GOOGLE_REVIEW');
  const [newActionTarget, setNewActionTarget] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [urlError, setUrlError] = useState<string>('');

  const { fields: actionFields, append: appendAction, remove: removeAction, move: moveAction, update: updateAction } = useFieldArray({
    control,
    name: "configuration.actions"
  });

  const getActionConfig = (type: ActionType) => {
    return ACTION_CONFIGS[type];
  };

  const validateUrl = (url: string, type: ActionType): boolean => {
    if (!url.trim()) return false;
    const config = getActionConfig(type);
    if (!config.urlRegex) return true;
    return config.urlRegex.test(url);
  };

  const handleTargetChange = (value: string) => {
    setNewActionTarget(value);
    
    if (value.trim() && !validateUrl(value, newActionType)) {
      const config = getActionConfig(newActionType);
      setUrlError(config.errorMessage || 'URL invalide');
    } else {
      setUrlError('');
    }
  };

  const handleAddAction = () => {
    setModalOpen(true);
    setNewActionType('GOOGLE_REVIEW');
    setNewActionTarget('');
    setUrlError('');
  };

  const handleSaveAction = () => {
    if (actionFields.length < 3) {
      const config = getActionConfig(newActionType);
      const newAction: Action = {
        id: Date.now().toString(),
        priority: actionFields.length + 1,
        target: config.hasTarget ? newActionTarget : '',
        type: newActionType
      };
      appendAction(newAction);
    }
    setModalOpen(false);
    setNewActionTarget('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewActionTarget('');
    setUrlError('');
  };

  // Fonctions de drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      // Déplacer l'élément
      moveAction(draggedIndex, dropIndex);
      
      // Mettre à jour les priorités
      updatePriorities(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const updatePriorities = (fromIndex: number, toIndex: number) => {
    // Créer une copie des actions avec les nouvelles priorités
    const updatedActions = [...actionFields];
    
    // Réorganiser le tableau
    const [movedItem] = updatedActions.splice(fromIndex, 1);
    updatedActions.splice(toIndex, 0, movedItem);
    
    // Mettre à jour les priorités
    updatedActions.forEach((action, index) => {
      updateAction(index, {
        ...action,
        priority: index + 1
      });
    });
  };

  const getOrderLabel = (index: number) => {
    switch(index) {
      case 0:
        return 'Première action';
      case 1:
        return 'Deuxième action';
      default:
        return 'Dernière action';
    }
  };

  const shouldShowTargetField = () => {
    const config = getActionConfig(newActionType);
    return config.hasTarget;
  };

  const isFormValid = () => {
    const config = getActionConfig(newActionType);
    if (!config.hasTarget) return true;
    return newActionTarget.trim() !== '' && validateUrl(newActionTarget, newActionType) && urlError === '';
  };

  return (
    <>
      <Card sx={{ mb: 3, borderRadius: 0, boxShadow: 'none', borderBottom: '1px solid #e5e7eb' }}>
        <CardContent sx={{ p: 3 }}>
          {/* En-tête avec titre et bouton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
                  ORGANISEZ VOS ACTIONS
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
                  Définissez l'ordre et les actions à réaliser par vos clients pour maximiser l'engagement.
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAction}
              disabled={actionFields.length >= 3}
              sx={{
                backgroundColor: actionFields.length >= 3 ? '#e5e7eb' : '#4285F4',
                color: actionFields.length >= 3 ? '#9ca3af' : 'white',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: actionFields.length >= 3 ? '#e5e7eb' : '#3367d6'
                },
                '&:disabled': {
                  backgroundColor: '#e5e7eb',
                  color: '#9ca3af'
                }
              }}
            >
              Ajouter une action {actionFields.length >= 3 && '(3 max)'}
            </Button>
          </Box>

          {/* Tableau des actions */}
          <Box sx={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            {/* En-tête du tableau */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: 2,
              p: 2,
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ordre des actions</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Action</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Cible</Typography>
              <Box sx={{ width: 40 }} />
            </Box>

            {/* Lignes des actions */}
            {actionFields.map((field: Action, index) => {
              const config = getActionConfig(field.type);
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;
              
              return (
                <Box key={field.id}>
                  <Box 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr auto',
                      gap: 2,
                      p: 2,
                      alignItems: 'center',
                      borderBottom: index < actionFields.length - 1 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: isDragging ? '#f0f9ff' : isDragOver ? '#e0f2fe' : 'transparent',
                      opacity: isDragging ? 0.5 : 1,
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      border: isDragOver ? '2px dashed #0288d1' : '2px solid transparent',
                      '&:hover': {
                        backgroundColor: isDragging ? '#f0f9ff' : '#f8fafc'
                      },
                      '&:active': {
                        cursor: 'grabbing'
                      }
                    }}
                  >
                    {/* Ordre */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DragIcon sx={{ 
                        cursor: 'grab', 
                        color: isDragging ? '#0288d1' : '#9ca3af',
                        '&:hover': {
                          color: '#0288d1'
                        }
                      }} />
                      <Typography variant="body2" color="text.secondary">
                        {getOrderLabel(index)}
                      </Typography>
                    </Box>

                    {/* Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: config.color }}>
                        {config.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {config.label}
                      </Typography>
                    </Box>

                    {/* Cible */}
                    <Box>
                      {config.hasTarget ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', flex: 1 }}>
                            {field.target || config.targetPlaceholder}
                          </Typography>
                          {config.isIntegrated && (
                            <Chip 
                              label="Intégré" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#d1fae5',
                                color: '#065f46',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                height: 20,
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }} 
                            />
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Button 
                            variant="text" 
                            size="small"
                            sx={{ 
                              color: '#4285F4',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              minWidth: 'auto',
                              p: 0,
                              fontSize: '0.875rem'
                            }}
                          >
                            Modifier
                          </Button>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#4285F4', fontSize: '0.875rem', fontWeight: 'bold' }}>
                              En savoir plus
                            </Typography>
                            <HelpIcon sx={{ fontSize: 16, color: '#4285F4' }} />
                          </Box>
                          {config.isIntegrated && (
                            <Chip 
                              label="Intégré" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#d1fae5',
                                color: '#065f46',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                height: 20,
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }} 
                            />
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Actions */}
                    <IconButton 
                      onClick={() => removeAction(index)} 
                      size="small"
                      sx={{ 
                        color: '#ef4444',
                        pointerEvents: isDragging ? 'none' : 'auto'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Alerte d'avertissement */}
          {actionFields.length === 1 && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 3,
                backgroundColor: '#FFF3C4',
                border: '1px solid #F59E0B',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#F59E0B'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ fontSize: 20 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#92400E' }}>
                    Une seule action = une seule participation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#92400E' }}>
                    Vos clients ne joueront qu'une seule fois si vous ne proposez qu'une seule action.
                  </Typography>
                </Box>
              </Box>
            </Alert>
          )}

          {actionFields.length >= 3 && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                backgroundColor: '#e0f2fe',
                border: '1px solid #0288d1',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#0288d1'
                }
              }}
            >
              <Typography variant="body2" sx={{ color: '#01579b' }}>
                Vous avez atteint le maximum de 3 actions par campagne.
              </Typography>
            </Alert>
          )}

          {/* Aide pour le drag and drop */}
          {actionFields.length > 1 && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#f8fafc', 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DragIcon sx={{ fontSize: 16, color: '#64748b' }} />
                Glissez-déposez les actions pour modifier leur ordre d'exécution
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modale d'ajout d'action */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper sx={{
          width: 500,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Ajouter une action
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type d'action</InputLabel>
              <Select
                value={newActionType}
                onChange={(e) => setNewActionType(e.target.value as ActionType)}
                label="Type d'action"
              >
                {Object.entries(ACTION_CONFIGS).map(([type, config]) => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: config.color }}>
                        {config.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {config.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {shouldShowTargetField() && (
              <TextField
                fullWidth
                label="URL cible"
                placeholder={getActionConfig(newActionType).targetPlaceholder}
                value={newActionTarget}
                onChange={(e) => handleTargetChange(e.target.value)}
                error={!!urlError}
                helperText={urlError || `Saisissez l'URL de votre ${getActionConfig(newActionType).label.toLowerCase()}`}
              />
            )}

            {!shouldShowTargetField() && (
              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configuration de {getActionConfig(newActionType).label.toLowerCase()} :
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{ 
                      color: '#4285F4',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      minWidth: 'auto',
                      p: 0
                    }}
                  >
                    Modifier
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#4285F4', fontWeight: 'bold' }}>
                      En savoir plus
                    </Typography>
                    <HelpIcon sx={{ fontSize: 16, color: '#4285F4' }} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveAction}
              disabled={!isFormValid()}
              sx={{
                backgroundColor: '#4285F4',
                '&:hover': {
                  backgroundColor: '#3367d6'
                }
              }}
            >
              Ajouter
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};