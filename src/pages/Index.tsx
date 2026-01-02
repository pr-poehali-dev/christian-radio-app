import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const STREAM_URL = 'https://radio-grace.site/public/radio_grace';

const Index = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.preload = 'none';
    audioRef.current.volume = volume / 100;

    audioRef.current.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    });

    audioRef.current.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audioRef.current.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audioRef.current.addEventListener('error', (e) => {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Не удалось подключиться к радио');
      console.error('Audio error:', e);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    let animationFrame: number;
    
    const animateWaves = () => {
      if (isPlaying) {
        setAudioLevels(prev => 
          prev.map(() => Math.random() * 60 + 20)
        );
      } else {
        setAudioLevels(prev => 
          prev.map(level => Math.max(0, level - 5))
        );
      }
      animationFrame = requestAnimationFrame(animateWaves);
    };

    animateWaves();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        setError(null);
        await audioRef.current.play();
      }
    } catch (err) {
      setError('Ошибка воспроизведения');
      setIsPlaying(false);
      setIsLoading(false);
      console.error('Playback error:', err);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden border-2 shadow-2xl animate-scale-in">
        <div className="relative h-64 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
            {audioLevels.map((level, i) => (
              <div
                key={i}
                className="flex-1 bg-white/40 rounded-full transition-all duration-200 ease-out"
                style={{
                  height: `${level}%`,
                  minHeight: '4px',
                  boxShadow: isPlaying ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              />
            ))}
          </div>

          <div className="absolute top-6 left-6">
            <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/40 text-sm px-3 py-1">
              <div className={`w-2 h-2 rounded-full mr-2 ${isPlaying ? 'bg-green-400 animate-pulse-glow' : 'bg-gray-400'}`}></div>
              {isPlaying ? 'В ЭФИРЕ' : 'НЕ В ЭФИРЕ'}
            </Badge>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon name="Radio" size={80} className="mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl font-bold drop-shadow-lg">Радио Благодать</h1>
              <p className="text-lg opacity-90 mt-2">Христианское радио онлайн</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={togglePlayPause}
              disabled={isLoading}
              size="lg"
              className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-all shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <Icon name="Loader2" size={40} className="text-white animate-spin" />
              ) : (
                <Icon name={isPlaying ? "Pause" : "Play"} size={40} className="text-white" />
              )}
            </Button>
          </div>

          {error && (
            <div className="text-center text-destructive text-sm bg-destructive/10 p-3 rounded-lg animate-fade-in">
              <Icon name="AlertCircle" size={16} className="inline mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Volume2" size={18} />
                Громкость
              </label>
              <span className="text-sm text-muted-foreground">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 animate-fade-in">
            <div className="flex items-start gap-3">
              <Icon name="Music" size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Сейчас в эфире</h3>
                <p className="text-sm text-muted-foreground">
                  Христианские песни прославления и проповеди
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Онлайн</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Христианская</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">🙏</div>
              <div className="text-xs text-muted-foreground">Благословение</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
