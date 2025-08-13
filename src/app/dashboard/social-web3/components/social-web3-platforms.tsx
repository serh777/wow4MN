'use client';

import * as React from 'react';

interface SocialWeb3PlatformsProps {
  platforms: Array<{
    name: string;
    connected: boolean;
    followers: number;
    posts: number;
    engagement: number;
  }>;
}

export function SocialWeb3Platforms({ platforms }: SocialWeb3PlatformsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Plataformas Sociales Web3</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{platform.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                platform.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {platform.connected ? 'Conectado' : 'No conectado'}
              </span>
            </div>
            {platform.connected && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                  <p className="text-sm font-medium">{platform.followers}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Posts</p>
                  <p className="text-sm font-medium">{platform.posts}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-sm font-medium">{platform.engagement}%</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}