import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Station {
  id: number;
  name: string;
  genre: string;
  live: boolean;
  listeners: number;
  streamUrl: string;
}

const stations: Station[] = [
  { id: 1, name: 'Благословение FM', genre: 'Современное прославление', live: true, listeners: 1247, streamUrl: '#' },
  { id: 2, name: 'Святая Волна', genre: 'Традиционные гимны', live: true, listeners: 892, streamUrl: '#' },
  { id: 3, name: 'Голос Веры', genre: 'Проповеди и учение', live: false, listeners: 654, streamUrl: '#' },
  { id: 4, name: 'Надежда 24/7', genre: 'Христианская музыка', live: true, listeners: 2103, streamUrl: '#' },
  { id: 5, name: 'Свет Истины', genre: 'Духовные беседы', live: false, listeners: 431, streamUrl: '#' },
  { id: 6, name: 'Радость Спасения', genre: 'Прославление', live: true, listeners: 1678, streamUrl: '#' },
];

const Index = () => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Array<Station & { playedAt: string }>>([]);

  const handlePlay = (station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    
    const playedAt = new Date().toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== station.id);
      return [{ ...station, playedAt }, ...filtered].slice(0, 10);
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Radio" size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Христианское Радио
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Слушайте христианские радиостанции онлайн</p>
        </header>

        <Tabs defaultValue="stations" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
            <TabsTrigger value="stations" className="text-base">
              <Icon name="Radio" size={18} className="mr-2" />
              Станции
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base">
              <Icon name="History" size={18} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((station, index) => (
                <Card 
                  key={station.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="Music2" size={64} className="text-white/30" />
                    </div>
                    {station.live && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white animate-pulse-glow border-0">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {station.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Music" size={14} />
                        {station.genre}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Users" size={14} />
                        {station.listeners.toLocaleString()}
                      </span>
                      <Button
                        onClick={() => handlePlay(station)}
                        size="lg"
                        className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform shadow-lg"
                      >
                        <Icon name="Play" size={24} className="text-white" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="History" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">История пуста</h3>
                <p className="text-muted-foreground">Начните слушать станции, чтобы увидеть историю</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <Card 
                    key={`${item.id}-${item.playedAt}`} 
                    className="p-6 hover:shadow-lg transition-all hover:border-primary animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Icon name="Radio" size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.genre}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {item.playedAt}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handlePlay(item)}
                        size="lg"
                        variant="outline"
                        className="rounded-full w-12 h-12 p-0 hover:bg-primary hover:text-white"
                      >
                        <Icon name="Play" size={20} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {currentStation && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t shadow-2xl animate-slide-up z-50">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center gap-6 max-w-4xl mx-auto">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
                  <Icon name="Radio" size={36} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg truncate">{currentStation.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{currentStation.genre}</p>
                  {currentStation.live && (
                    <Badge className="mt-2 bg-red-500 text-white animate-pulse-glow border-0 text-xs">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></div>
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full hover:bg-primary/10"
                  >
                    <Icon name="SkipBack" size={24} />
                  </Button>
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform shadow-xl"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={28} className="text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full hover:bg-primary/10"
                  >
                    <Icon name="SkipForward" size={24} />
                  </Button>
                  <div className="flex items-center gap-2 ml-4">
                    <Icon name="Volume2" size={20} className="text-muted-foreground" />
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
