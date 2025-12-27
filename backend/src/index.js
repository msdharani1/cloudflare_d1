export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // GET /products - List all products
            if (path === '/products' && method === 'GET') {
                const { results } = await env.DB.prepare(
                    'SELECT * FROM products ORDER BY created_at DESC'
                ).all();
                return new Response(JSON.stringify(results), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            // POST /products - Add product
            if (path === '/products' && method === 'POST') {
                const { name, description, price, image_url } = await request.json();
                if (!name || !price) {
                    return new Response('Name and price are required', { status: 400, headers: corsHeaders });
                }
                await env.DB.prepare(
                    'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)'
                )
                    .bind(name, description, price, image_url)
                    .run();
                return new Response('Product added', { status: 201, headers: corsHeaders });
            }

            // PUT /products/:id - Update product
            if (path.startsWith('/products/') && method === 'PUT') {
                const id = path.split('/')[2];
                const { name, description, price, image_url } = await request.json();
                await env.DB.prepare(
                    'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?'
                )
                    .bind(name, description, price, image_url, id)
                    .run();
                return new Response('Product updated', { headers: corsHeaders });
            }

            // DELETE /products/:id - Delete product
            if (path.startsWith('/products/') && method === 'DELETE') {
                const id = path.split('/')[2];
                await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
                return new Response('Product deleted', { headers: corsHeaders });
            }

            return new Response('Not Found', { status: 404, headers: corsHeaders });
        } catch (err) {
            return new Response(err.message, { status: 500, headers: corsHeaders });
        }
    },
};
