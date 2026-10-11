redcheery.com.conf
root@srv1442407:/etc/nginx/sites-available# cat redcheery.com.conf
server {
client_max_body_size 200M; # ← ADD THIS — fixes all upload blocking

    server_name redcheery.com www.redcheery.com;

    root /root/RedCherryApp/user-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ^~ /host {
    alias /root/RedCherryApp/host-frontend/dist;
    index index.html;
    try_files $uri $uri/ /host/index.html;

}

    location @host_fallback {
        root /root/RedCherryApp/host-frontend/dist;
        rewrite ^ /index.html break;
    }

    location /api/host/ {
        proxy_pass http://localhost:5001/api/host/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

      location /socket.io/ {
    proxy_pass http://localhost:5001/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;

}

    # User backend uploads
    location /uploads/ {
        alias /root/RedCherryApp/user-backend/uploads/;   # ← NO trailing slash issue
        try_files $uri =404;
    }

    # Host backend uploads
    location /host-uploads/ {
        alias /root/RedCherryApp/host-backend/uploads/;
        try_files $uri =404;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/redcheery.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/redcheery.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

}

server {
if ($host = www.redcheery.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = redcheery.com) {
return 301 https://$host$request_uri;
}
listen 80;
server_name redcheery.com www.redcheery.com;
return 404;
}

=======latest 06/04/26-============
server {
client_max_body_size 200M;

    server_name redcheery.com www.redcheery.com;

    root /root/RedCherryApp/user-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ^~ /host {
        alias /root/RedCherryApp/host-frontend/dist;
        index index.html;
        try_files $uri $uri/ @host_fallback;
    }

    location @host_fallback {
        root /root/RedCherryApp/host-frontend/dist;
        rewrite ^ /index.html break;
    }

    # ── Host backend API ──────────────────────────────────────────────────────
    location /api/host/ {
        proxy_pass http://localhost:5001/api/host/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # ✅ FIX: Forward custom headers (x-admin-key, Authorization, etc.)
        proxy_set_header x-admin-key $http_x_admin_key;
        proxy_pass_header x-admin-key;
        proxy_cache_bypass $http_upgrade;
    }

    # ── User backend API ──────────────────────────────────────────────────────
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # ✅ FIX: Forward custom headers (x-admin-key, Authorization, etc.)
        proxy_set_header x-admin-key $http_x_admin_key;
        proxy_pass_header x-admin-key;
        proxy_cache_bypass $http_upgrade;
    }

    # ── Socket.IO ─────────────────────────────────────────────────────────────
    location /socket.io/ {
        proxy_pass http://localhost:5001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # ── User backend uploads ──────────────────────────────────────────────────
    location /uploads/ {
        alias /root/RedCherryApp/user-backend/uploads/;
        try_files $uri =404;
    }

    # ── Host backend uploads ──────────────────────────────────────────────────
    location /host-uploads/ {
        alias /root/RedCherryApp/host-backend/uploads/;
        try_files $uri =404;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/redcheery.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/redcheery.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

}

server {
if ($host = www.redcheery.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = redcheery.com) {
return 301 https://$host$request_uri;
}
listen 80;
server_name redcheery.com www.redcheery.com;
return 404;
}
