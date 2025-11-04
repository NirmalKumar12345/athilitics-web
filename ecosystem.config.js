module.exports = {
  apps: [
    {
      name: 'athletics-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000', // Use your desired port
      cwd: './', // Current working directory
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://api.athlitics.com',
      },
      instances: 1, // Or 'max' for clustering
      exec_mode: 'fork', // Or 'cluster' for multi-core
      watch: false, // Set to true if you want to restart on file changes
      max_memory_restart: '500M', // Restart if memory exceeds this
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 5000,
    },
  ],
};
