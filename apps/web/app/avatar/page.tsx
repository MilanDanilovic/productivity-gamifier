'use client';

import { useState, useEffect } from 'react';
import { useRewards } from '@/lib/hooks/use-rewards';
import { useMe } from '@/lib/hooks/use-auth';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface AvatarItem {
  _id: string;
  title: string;
  itemType: 'SKIN' | 'HAT' | 'WEAPON' | 'SHIELD' | 'ACCESSORY';
  icon?: string;
  color?: string;
  isClaimed?: boolean;
}

const CHARACTER_OPTIONS = [
  { id: 'mage', icon: '🧙', name: 'Mage', color: '#8b5cf6' },
  { id: 'warrior', icon: '⚔️', name: 'Warrior', color: '#ef4444' },
  { id: 'rogue', icon: '🗡️', name: 'Rogue', color: '#06b6d4' },
  { id: 'archer', icon: '🏹', name: 'Archer', color: '#22c55e' },
  { id: 'knight', icon: '🛡️', name: 'Knight', color: '#f59e0b' },
  { id: 'ninja', icon: '🥷', name: 'Ninja', color: '#6b7280' },
];

const EQUIPMENT_SLOTS = [
  { type: 'SKIN', label: 'Character', icon: '👤', position: 'center' },
  { type: 'HAT', label: 'Headgear', icon: '🎩', position: 'top' },
  { type: 'WEAPON', label: 'Weapon', icon: '⚔️', position: 'right' },
  { type: 'SHIELD', label: 'Shield', icon: '🛡️', position: 'left' },
  { type: 'ACCESSORY', label: 'Accessory', icon: '💎', position: 'special' },
];

export default function AvatarPage() {
  const { data: rewards, isLoading } = useRewards();
  const { data: user } = useMe();
  const { toast } = useToast();
  
  const [selectedCharacter, setSelectedCharacter] = useState('mage');
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    SKIN: '',
    HAT: '',
    WEAPON: '',
    SHIELD: '',
    ACCESSORY: '',
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Load saved avatar from localStorage
  useEffect(() => {
    setMounted(true);
    const savedCharacter = localStorage.getItem('avatarCharacter');
    const savedItems = localStorage.getItem('avatarItems');
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }
    if (savedItems) {
      try {
        setSelectedItems(JSON.parse(savedItems));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save avatar to localStorage
  const saveAvatar = () => {
    localStorage.setItem('avatarCharacter', selectedCharacter);
    localStorage.setItem('avatarItems', JSON.stringify(selectedItems));
    toast({
      title: '✨ AVATAR SAVED! ✨',
      description: 'Your character has been customized!',
    });
  };

  const claimedRewards = rewards?.filter((r) => r.isClaimed) || [];
  
  const itemsByType = {
    SKIN: claimedRewards.filter((r) => r.itemType === 'SKIN'),
    HAT: claimedRewards.filter((r) => r.itemType === 'HAT'),
    WEAPON: claimedRewards.filter((r) => r.itemType === 'WEAPON'),
    SHIELD: claimedRewards.filter((r) => r.itemType === 'SHIELD'),
    ACCESSORY: claimedRewards.filter((r) => r.itemType === 'ACCESSORY'),
  };

  const handleSelectItem = (itemType: string, itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemType]: prev[itemType] === itemId ? '' : itemId,
    }));
  };

  const selectedSkin = itemsByType.SKIN.find((r) => r._id === selectedItems.SKIN);
  const selectedHat = itemsByType.HAT.find((r) => r._id === selectedItems.HAT);
  const selectedWeapon = itemsByType.WEAPON.find((r) => r._id === selectedItems.WEAPON);
  const selectedShield = itemsByType.SHIELD.find((r) => r._id === selectedItems.SHIELD);
  const selectedAccessory = itemsByType.ACCESSORY.find((r) => r._id === selectedItems.ACCESSORY);

  const currentCharacter = CHARACTER_OPTIONS.find(c => c.id === selectedCharacter) || CHARACTER_OPTIONS[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-pulse-retro">⏳</div>
            <p className="retro-text text-center">Loading avatar customization...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-background via-background/95 to-background/90 particle-effect">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6 max-w-7xl">
        <Card className="retro-card bg-card/80 backdrop-blur-sm border-primary/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="retro-text text-lg sm:text-2xl text-primary flex items-center gap-2">
                  <span className="animate-float">✨</span>
                  CHARACTER CUSTOMIZATION
                  <span className="animate-float">✨</span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Choose your character class and equip items to customize your hero
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant="outline"
                  className="retro-button text-xs"
                >
                  {isPreviewMode ? '🔧 EDIT' : '👁️ PREVIEW'}
                </Button>
                <Button onClick={saveAvatar} className="retro-button text-xs">
                  💾 SAVE
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Character Preview - Large Center Display */}
              <div className="lg:col-span-2 space-y-4">
                {/* Character Display */}
                <Card className="retro-card bg-gradient-to-b from-primary/5 to-primary/10 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[450px] space-y-4 relative">
                      {/* Background Scene */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/50 to-transparent" />
                      
                      {/* Character with Equipment */}
                      <div className="relative z-10 mb-8">
                        {/* Hat - Above character */}
                        {selectedHat && (
                          <div 
                            className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 text-5xl sm:text-7xl animate-bounce-slow"
                            style={{ filter: `drop-shadow(0 0 15px ${selectedHat.color || '#fff'})` }}
                          >
                            {selectedHat.icon || '🎩'}
                          </div>
                        )}
                        
                        {/* Accessory - Floating above */}
                        {selectedAccessory && (
                          <div 
                            className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl animate-float"
                            style={{ filter: `drop-shadow(0 0 12px ${selectedAccessory.color || '#fff'})` }}
                          >
                            {selectedAccessory.icon || '👑'}
                          </div>
                        )}
                        
                        {/* Main Character */}
                        <div 
                          className="text-8xl sm:text-9xl transition-all duration-500 cursor-pointer hover:scale-110 relative"
                          style={{ 
                            filter: selectedSkin?.color 
                              ? `drop-shadow(0 0 25px ${selectedSkin.color})` 
                              : `drop-shadow(0 0 25px ${currentCharacter.color})`
                          }}
                        >
                          <span className="animate-pulse-retro">{currentCharacter.icon}</span>
                        </div>
                        
                        {/* Shield - Left side */}
                        {selectedShield && (
                          <div 
                            className="absolute top-1/2 -left-16 sm:-left-24 transform -translate-y-1/2 text-5xl sm:text-7xl glow-animation"
                            style={{ filter: `drop-shadow(0 0 15px ${selectedShield.color || '#fff'})` }}
                          >
                            {selectedShield.icon || '🛡️'}
                          </div>
                        )}
                        
                        {/* Weapon - Right side */}
                        {selectedWeapon && (
                          <div 
                            className="absolute top-1/2 -right-16 sm:-right-24 transform -translate-y-1/2 text-5xl sm:text-7xl animate-swing"
                            style={{ filter: `drop-shadow(0 0 15px ${selectedWeapon.color || '#fff'})` }}
                          >
                            {selectedWeapon.icon || '⚔️'}
                          </div>
                        )}
                      </div>
                      
                      {/* Character Info Card */}
                      <div className="retro-card bg-card/90 backdrop-blur-sm p-4 min-w-[250px] relative z-10">
                        <div className="text-center space-y-2">
                          <Badge 
                            className="retro-text text-xs mb-2" 
                            style={{ backgroundColor: `${currentCharacter.color}40`, borderColor: currentCharacter.color }}
                          >
                            {currentCharacter.name.toUpperCase()}
                          </Badge>
                          <p className="retro-text text-sm sm:text-lg text-primary">{user?.displayName || 'Player'}</p>
                          <div className="flex items-center justify-center gap-3 text-xs">
                            <span className="retro-text text-primary">LV.{user?.level || 1}</span>
                            <span>•</span>
                            <span className="retro-text">{user?.totalXp || 0} XP</span>
                            <span>•</span>
                            <Badge variant="outline" className="retro-text text-xs">
                              🔥 {user?.streakCount || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Slots */}
                {!isPreviewMode && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                    {EQUIPMENT_SLOTS.map((slot) => {
                      const equipped = selectedItems[slot.type as keyof typeof selectedItems];
                      const equippedItem = equipped ? [...itemsByType.HAT, ...itemsByType.WEAPON, ...itemsByType.SHIELD, ...itemsByType.ACCESSORY, ...itemsByType.SKIN].find(i => i._id === equipped) : null;
                      
                      return (
                        <div 
                          key={slot.type}
                          className={`retro-card p-3 text-center transition-all cursor-pointer relative group ${
                            equipped ? 'bg-primary/20 border-primary/50' : 'bg-card/50 hover:bg-card/70'
                          }`}
                        >
                          <div className="text-2xl mb-1">{equippedItem?.icon || slot.icon}</div>
                          <div className="retro-text text-xs truncate">{slot.label}</div>
                          {equipped && (
                            <div className="absolute -top-1 -right-1">
                              <Badge variant="default" className="retro-text text-xs h-4 px-1 bg-primary">✓</Badge>
                            </div>
                          )}
                          {!equipped && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="retro-text text-xs text-primary">EMPTY</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customization Panel */}
              <div className="space-y-4">
                {!isPreviewMode && (
                  <>
                    {/* Character Selection */}
                    <Card className="retro-card bg-card/50">
                      <CardHeader>
                        <CardTitle className="retro-text text-sm text-primary">SELECT CLASS</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-2 gap-2">
                          {CHARACTER_OPTIONS.map((char) => (
                            <button
                              key={char.id}
                              onClick={() => setSelectedCharacter(char.id)}
                              className={`retro-card p-3 text-center transition-all relative overflow-hidden group ${
                                selectedCharacter === char.id
                                  ? 'bg-primary/20 border-primary scale-105'
                                  : 'bg-card/80 hover:scale-105'
                              }`}
                              style={selectedCharacter === char.id ? { 
                                borderColor: char.color,
                                boxShadow: `0 0 20px ${char.color}40`
                              } : {}}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                              <div 
                                className="text-3xl mb-1 transition-transform group-hover:scale-125 relative z-10"
                                style={selectedCharacter === char.id ? { filter: `drop-shadow(0 0 8px ${char.color})` } : {}}
                              >
                                {char.icon}
                              </div>
                              <p className="retro-text text-xs truncate relative z-10">{char.name}</p>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Equipment Selection */}
                    <Card className="retro-card bg-card/50">
                      <CardHeader>
                        <CardTitle className="retro-text text-sm text-primary">EQUIPMENT</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <Tabs defaultValue="HAT" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 gap-1 mb-3">
                            <TabsTrigger value="HAT" className="retro-text text-xs px-1">HAT</TabsTrigger>
                            <TabsTrigger value="WEAPON" className="retro-text text-xs px-1">WPN</TabsTrigger>
                            <TabsTrigger value="SHIELD" className="retro-text text-xs px-1">SHD</TabsTrigger>
                            <TabsTrigger value="ACCESSORY" className="retro-text text-xs px-1">ACC</TabsTrigger>
                          </TabsList>
                          
                          {(['HAT', 'WEAPON', 'SHIELD', 'ACCESSORY'] as const).map((type) => (
                            <TabsContent key={type} value={type} className="mt-0">
                              {itemsByType[type].length === 0 ? (
                                <div className="text-center py-6">
                                  <div className="text-3xl mb-2 opacity-50">🔒</div>
                                  <p className="text-xs text-muted-foreground retro-text">
                                    No items unlocked
                                  </p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                  {itemsByType[type].map((item) => {
                                    const isSelected = selectedItems[type] === item._id;
                                    return (
                                      <button
                                        key={item._id}
                                        onClick={() => handleSelectItem(type, item._id)}
                                        className={`retro-card p-2 text-center transition-all duration-300 relative overflow-hidden group ${
                                          isSelected
                                            ? 'border-primary border-2 scale-105'
                                            : 'hover:scale-105 hover:border-primary/50'
                                        }`}
                                        style={isSelected && item.color ? { 
                                          borderColor: item.color,
                                          boxShadow: `0 0 15px ${item.color}40`
                                        } : {}}
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        <div 
                                          className="text-2xl mb-1 transition-transform group-hover:scale-125 relative z-10"
                                          style={isSelected && item.color ? { filter: `drop-shadow(0 0 5px ${item.color})` } : {}}
                                        >
                                          {item.icon || '🎁'}
                                        </div>
                                        <p className="retro-text text-xs truncate relative z-10">{item.title}</p>
                                        {isSelected && (
                                          <div className="absolute top-1 right-1">
                                            <Badge variant="default" className="retro-text text-xs h-4 px-1 bg-primary">✓</Badge>
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Stats Summary */}
                {isPreviewMode && (
                  <Card className="retro-card bg-card/50">
                    <CardHeader>
                      <CardTitle className="retro-text text-sm text-primary">CHARACTER STATS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Class:</span>
                        <Badge className="retro-text text-xs" style={{ backgroundColor: `${currentCharacter.color}40` }}>
                          {currentCharacter.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Equipment:</span>
                        <span className="retro-text text-xs">{Object.values(selectedItems).filter(Boolean).length}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Power Level:</span>
                        <span className="retro-text text-xs text-primary">
                          {(user?.level || 1) * 10 + Object.values(selectedItems).filter(Boolean).length * 5}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="retro-card bg-primary/10 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl animate-pulse-retro">💡</div>
              <div className="flex-1">
                <p className="retro-text text-xs text-primary mb-1">PRO TIP</p>
                <p className="text-xs text-muted-foreground">
                  Unlock more equipment by completing quests and reaching XP milestones. Each piece adds to your character's power level!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
