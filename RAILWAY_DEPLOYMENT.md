# Railway Deployment Guide for DhronePredicts Management System

## Prerequisites
- GitHub repository containing your DhronePredicts Management System code
- Railway account (sign up at railway.app)

## Deployment Steps

### 1. Prepare Your Code
Ensure your repository includes:
- `railway.toml` (configuration file)
- Updated `package.json` with build script
- All source code and data files

### 2. Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 3. Connect Repository to Railway
1. Go to [Railway.app](https://railway.app) and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Choose your DhronePredicts repository from the list

### 4. Configure Environment Variables
In your Railway project dashboard:
1. Go to "Variables" tab
2. Add the following variables:
   - `NODE_ENV` = `production`
   - `ADMIN_EMAIL` = `admin@dhronepredicts.com`
   - `ADMIN_PASSWORD` = `dhrone123`
   - `PORT` = (leave blank, Railway will assign automatically)

### 5. Deploy
Railway will automatically:
- Detect it's a Node.js project
- Run `npm install` to install dependencies
- Run `npm run build` to build the React frontend
- Run `npm start` to start the Express server
- Perform health checks on `/api/auth/verify`

### 6. Access Your Application
Once deployment is complete:
- Railway will provide a public URL (e.g., `https://your-project.up.railway.app`)
- Visit the URL to access the admin dashboard
- Login with: `admin@dhronepredicts.com` / `dhrone123`

## Troubleshooting

### Build Failures
- Check Railway logs in the dashboard
- Ensure all dependencies are listed in `package.json`
- Verify `client/package.json` has the correct build script

### Runtime Issues
- Check environment variables are set correctly
- Ensure `/data` directory permissions allow writing
- Verify CORS settings if accessing from different domains

### Data Persistence
- JSON files are stored in the container's filesystem
- Data persists between deployments but may be lost if container is destroyed
- Consider migrating to a database for production use

## Production Considerations
- Change default admin credentials
- Implement proper authentication (JWT, sessions)
- Add rate limiting and input validation
- Consider using Railway's database services instead of JSON files
- Set up monitoring and logging

## Support
For Railway-specific issues, check their documentation at docs.railway.app