// app.js

import { makeBadge } from 'badge-maker';
const axios = require('axios');

const DISCORD_BOT_TOKEN = process.env.TOKEN;
console.log(DISCORD_BOT_TOKEN);

async function fetchDiscordPresence(userId, guildId) {
    const headers = {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    };
  
    try {
      const response = await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`, { headers });
      const presence = response.data;
      console.log(presence);
      const status = presence.status;
      return status;
    } catch (error) {
      console.error('Error fetching user presence:', error.response.data);
      return null;
    }
}

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    // Fetch Discord presence
    try {
        const discordUser = await fetchDiscordPresence("718503475222413353", "1067699570307502120");
        console.log(discordUser);
      } catch (error) {
        console.error('Error fetching Discord presence:', error);
      }

    if (!discordUser) {
      // If user data is not available, return a default badge
      const defaultBadgeFormat = {
        label: 'Discord Presence',
        message: 'Unavailable',
        color: 'red',
      };
      reply.header('Content-Type', 'image/svg+xml');
      const svg = makeBadge(defaultBadgeFormat);
      return svg;
    }

    // Extract relevant data from Discord user
    const label = 'Discord Presence';
    const message = discordUser.presence.status;
    const color = 'green';

    // Generate badge format
    const badgeFormat = {
      label,
      message,
      color,
    };

    // Set the content type header to indicate that the response is SVG
    reply.header('Content-Type', 'image/svg+xml');

    // Generate the badge SVG
    const svg = makeBadge(badgeFormat);

    // Return the badge SVG
    return svg;
  });
}

export default routes;
