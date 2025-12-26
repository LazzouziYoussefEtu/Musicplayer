import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import fs from 'node:fs';
import * as mm from 'music-metadata';
import ytsr from 'ytsr';
import bootstrap from './src/main.server';

const MUSIC_PATH = '/home/centos_youssef/Documents/Code/Python/SpotDl/music';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // API for Local Library
  server.get('/api/search/youtube', async (req, res) => {
    try {
      const query = req.query['q'] as string;
      if (!query) {
        res.json([]);
        return;
      }

      // Check if query looks like a video ID (11 chars) or a full URL
      const isId = /^[a-zA-Z0-9_-]{11}$/.test(query);
      
      let searchResults;
      if (isId) {
        searchResults = await ytsr(`https://www.youtube.com/watch?v=${query}`, { limit: 1 });
      } else {
        const filters = await ytsr.getFilters(query);
        const filter = filters.get('Type')?.get('Video');
        if (!filter || !filter.url) {
          res.json([]);
          return;
        }
        searchResults = await ytsr(filter.url, { limit: 10 });
      }

      const songs = searchResults.items.filter(item => item.type === 'video').map(item => {
        const video = item as ytsr.Video;
        return {
          id: `yt-${video.id}`,
          title: video.title,
          duration: parseDuration(video.duration || '0:00'),
          audioUrl: `https://www.youtube.com/watch?v=${video.id}`,
          coverUrl: video.bestThumbnail.url,
          releaseDate: new Date(),
          playCount: 0,
          source: 'youtube',
          genre: { id: 'youtube', name: 'YouTube', description: '' },
          artist: {
            id: `yt-author-${video.author?.channelID || 'unknown'}`,
            name: video.author?.name || 'Unknown Artist',
            imageUrl: video.author?.bestAvatar?.url || 'https://via.placeholder.com/300?text=YT',
            bio: '',
            followers: 0
          },
          album: {
            id: `yt-album-${video.id}`,
            title: 'YouTube Video',
            artist: { name: video.author?.name || 'Unknown Artist' } as any,
            coverUrl: video.bestThumbnail.url,
            releaseDate: new Date(),
            totalDuration: 0,
            songCount: 0
          }
        };
      });

      res.json(songs);
    } catch (error) {
      console.error('YouTube search error:', error);
      res.status(500).send('YouTube search failed');
    }
  });

  server.get('/api/local-library', async (req, res) => {
    try {
      if (!fs.existsSync(MUSIC_PATH)) {
        res.json([]);
        return;
      }

      const files = fs.readdirSync(MUSIC_PATH).filter(f => 
        ['.mp3', '.m4a', '.wav', '.flac'].includes(f.toLowerCase().slice(-4))
      );

      const songs = await Promise.all(files.map(async (file, index) => {
        const filePath = join(MUSIC_PATH, file);
        const metadata = await mm.parseFile(filePath);
        
        const artistName = metadata.common.artist || 'Unknown Artist';
        const albumName = metadata.common.album || 'Unknown Album';
        
        return {
          id: `local-${index}`,
          title: metadata.common.title || file.replace(/\.[^/.]+$/, ""),
          duration: Math.round(metadata.format.duration || 0),
          audioUrl: `/api/stream/${encodeURIComponent(file)}`,
          coverUrl: metadata.common.picture ? `/api/cover/${encodeURIComponent(file)}` : 'https://via.placeholder.com/300?text=No+Cover',
          releaseDate: metadata.common.date ? new Date(metadata.common.date) : new Date(),
          playCount: 0,
          genre: { id: 'local', name: metadata.common.genre?.[0] || 'Local', description: '' },
          artist: {
            id: `artist-${artistName.toLowerCase().replace(/ /g, '-')}`,
            name: artistName,
            imageUrl: 'https://via.placeholder.com/300?text=' + encodeURIComponent(artistName),
            bio: '',
            followers: 0
          },
          album: {
            id: `album-${albumName.toLowerCase().replace(/ /g, '-')}`,
            title: albumName,
            artist: { name: artistName } as any,
            coverUrl: metadata.common.picture ? `/api/cover/${encodeURIComponent(file)}` : 'https://via.placeholder.com/300?text=No+Cover',
            releaseDate: metadata.common.date ? new Date(metadata.common.date) : new Date(),
            totalDuration: 0,
            songCount: 0
          }
        };
      }));

      res.json(songs);
    } catch (error) {
      console.error('Error scanning local library:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  server.get('/api/stream/:filename', (req, res) => {
    const filePath = join(MUSIC_PATH, decodeURIComponent(req.params.filename));
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  server.get('/api/cover/:filename', async (req, res) => {
    try {
      const filePath = join(MUSIC_PATH, decodeURIComponent(req.params.filename));
      const metadata = await mm.parseFile(filePath);
      const picture = metadata.common.picture?.[0];
      
      if (picture) {
        res.contentType(picture.format);
        res.send(picture.data);
      } else {
        res.redirect('https://via.placeholder.com/300?text=No+Cover');
      }
    } catch (error) {
      res.status(500).send('Error extracting cover');
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function parseDuration(duration: string): number {
  const parts = duration.split(':').reverse();
  let seconds = 0;
  for (let i = 0; i < parts.length; i++) {
    seconds += parseInt(parts[i]) * Math.pow(60, i);
  }
  return seconds;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
