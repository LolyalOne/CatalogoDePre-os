import os

templates = {
    "Catalogo_3_Pricing_Modern": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planos e Preços - Moderno</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>Escolha seu Plano</h1>
        <p>Soluções ideais para o seu negócio crescer.</p>
        <div class="pricing-cards">
            <div class="card">
                <h2>Básico</h2>
                <div class="price">R$ 49<span>/mês</span></div>
                <ul>
                    <li>1 Usuário</li>
                    <li>Suporte Básico</li>
                    <li>Catálogo Simples</li>
                </ul>
                <button>Assinar Agora</button>
            </div>
            <div class="card popular">
                <div class="badge">Mais Popular</div>
                <h2>Pro</h2>
                <div class="price">R$ 99<span>/mês</span></div>
                <ul>
                    <li>5 Usuários</li>
                    <li>Suporte Prioritário</li>
                    <li>Cardápio Animado</li>
                    <li>Relatórios</li>
                </ul>
                <button>Assinar Agora</button>
            </div>
            <div class="card">
                <h2>Enterprise</h2>
                <div class="price">R$ 199<span>/mês</span></div>
                <ul>
                    <li>Usuários Ilimitados</li>
                    <li>Suporte 24/7</li>
                    <li>Integrações</li>
                    <li>Personalização Total</li>
                </ul>
                <button>Assinar Agora</button>
            </div>
        </div>
    </div>
</body>
</html>""",
        "style.css": """* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { background: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.container { text-align: center; padding: 40px; }
h1 { font-size: 2.5rem; margin-bottom: 10px; background: -webkit-linear-gradient(#38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
p { color: #94a3b8; margin-bottom: 50px; }
.pricing-cards { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; }
.card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); width: 300px; transition: transform 0.3s; position: relative; }
.card:hover { transform: translateY(-10px); border-color: #38bdf8; }
.card h2 { font-size: 1.5rem; margin-bottom: 20px; }
.price { font-size: 3rem; font-weight: 700; margin-bottom: 30px; }
.price span { font-size: 1rem; color: #94a3b8; }
ul { list-style: none; text-align: left; margin-bottom: 30px; }
li { margin-bottom: 15px; color: #cbd5e1; }
li::before { content: '✓'; color: #38bdf8; margin-right: 10px; }
button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: #38bdf8; color: #0f172a; font-weight: 700; cursor: pointer; transition: background 0.3s; }
button:hover { background: #7dd3fc; }
.card.popular { background: rgba(56, 189, 248, 0.1); border-color: #38bdf8; transform: scale(1.05); }
.card.popular:hover { transform: scale(1.05) translateY(-10px); }
.badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #38bdf8; color: #0f172a; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }"""
    },
    "Catalogo_4_Menu_Animado": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cardápio Digital Animado</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <h1>Sabores Premium</h1>
        <p>Explore nosso menu interativo</p>
    </header>
    <main class="menu-grid">
        <div class="menu-item">
            <div class="img-placeholder" style="background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);"></div>
            <div class="content">
                <h3>Hambúrguer Artesanal</h3>
                <p>Blend de carnes nobres, queijo cheddar, bacon crocante.</p>
                <div class="price">R$ 35,90</div>
            </div>
        </div>
        <div class="menu-item">
            <div class="img-placeholder" style="background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);"></div>
            <div class="content">
                <h3>Pizza Margherita</h3>
                <p>Massa de fermentação natural, molho de tomate pelati, manjericão fresco.</p>
                <div class="price">R$ 55,00</div>
            </div>
        </div>
        <div class="menu-item">
            <div class="img-placeholder" style="background: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);"></div>
            <div class="content">
                <h3>Salada Fit</h3>
                <p>Folhas verdes, tomate cereja, frango grelhado e molho especial.</p>
                <div class="price">R$ 28,50</div>
            </div>
        </div>
        <div class="menu-item">
            <div class="img-placeholder" style="background: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);"></div>
            <div class="content">
                <h3>Sorvete Artesanal</h3>
                <p>Baunilha de Madagascar com calda de frutas vermelhas.</p>
                <div class="price">R$ 18,90</div>
            </div>
        </div>
    </main>
</body>
</html>""",
        "style.css": """* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Outfit', sans-serif; }
body { background: #fafafa; color: #333; }
header { text-align: center; padding: 60px 20px; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
h1 { font-size: 3rem; color: #1a1a1a; margin-bottom: 10px; }
header p { color: #666; font-size: 1.2rem; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; padding: 40px; max-width: 1200px; margin: 0 auto; }
.menu-item { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
.menu-item:hover { transform: translateY(-15px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
.img-placeholder { height: 200px; width: 100%; transition: transform 0.5s; }
.menu-item:hover .img-placeholder { transform: scale(1.1); }
.content { padding: 25px; position: relative; z-index: 1; background: #fff; }
h3 { font-size: 1.5rem; margin-bottom: 10px; color: #222; }
.content p { color: #777; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5; }
.price { font-size: 1.4rem; font-weight: 700; color: #e63946; }"""
    },
    "Catalogo_5_Landing_Page": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Landing Page - Produto</title>
    <style>
        body { font-family: 'Helvetica Neue', sans-serif; margin: 0; background: #fff; color: #111; }
        .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; background: radial-gradient(circle at center, #f0f0f0 0%, #fff 100%); }
        h1 { font-size: 4rem; letter-spacing: -2px; margin: 0 0 20px; }
        p { font-size: 1.5rem; color: #555; max-width: 600px; margin: 0 0 40px; }
        .btn { padding: 15px 40px; background: #000; color: #fff; text-decoration: none; border-radius: 30px; font-size: 1.2rem; font-weight: bold; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.8; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>O Futuro chegou.</h1>
        <p>Apresentamos a solução definitiva para escalar suas vendas e atrair mais clientes para o seu negócio.</p>
        <a href="#" class="btn">Saiba Mais</a>
    </div>
</body>
</html>"""
    },
    "Catalogo_6_Portfolio": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Agência Criativa</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; background: #1a1a1a; color: #eee; }
        header { padding: 40px; border-bottom: 1px solid #333; }
        h1 { font-size: 2rem; margin: 0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 40px; }
        .item { background: #333; height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: background 0.3s; }
        .item:hover { background: #ff4b4b; cursor: pointer; color: #fff; }
    </style>
</head>
<body>
    <header><h1>Agência Criativa</h1></header>
    <div class="grid">
        <div class="item">Projeto 1</div>
        <div class="item">Projeto 2</div>
        <div class="item">Projeto 3</div>
        <div class="item">Projeto 4</div>
    </div>
</body>
</html>"""
    },
    "Catalogo_7_ECommerce_Grid": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Loja Virtual</title>
    <style>
        body { font-family: sans-serif; margin: 0; background: #f9f9f9; }
        .navbar { background: #fff; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
        .navbar h2 { margin: 0; color: #333; }
        .products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 40px; }
        .product { background: #fff; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #eee; transition: box-shadow 0.2s; }
        .product:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .img { height: 150px; background: #eee; margin-bottom: 15px; border-radius: 4px; }
        .price { font-weight: bold; color: #27ae60; margin: 10px 0; }
        button { background: #3498db; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="navbar"><h2>Minha Loja</h2><div>Carrinho (0)</div></div>
    <div class="products">
        <div class="product"><div class="img"></div><h3>Produto A</h3><div class="price">R$ 199,90</div><button>Comprar</button></div>
        <div class="product"><div class="img"></div><h3>Produto B</h3><div class="price">R$ 89,90</div><button>Comprar</button></div>
        <div class="product"><div class="img"></div><h3>Produto C</h3><div class="price">R$ 249,90</div><button>Comprar</button></div>
        <div class="product"><div class="img"></div><h3>Produto D</h3><div class="price">R$ 14,90</div><button>Comprar</button></div>
    </div>
</body>
</html>"""
    },
    "Catalogo_8_Dashboard_Admin": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Painel Administrativo</title>
    <style>
        body { font-family: sans-serif; margin: 0; display: flex; height: 100vh; background: #f0f2f5; }
        .sidebar { width: 250px; background: #1e1e2d; color: #a2a3b7; padding: 20px; }
        .sidebar h2 { color: #fff; margin-bottom: 30px; }
        .sidebar ul { list-style: none; padding: 0; }
        .sidebar li { padding: 15px 0; border-bottom: 1px solid #2b2b40; cursor: pointer; }
        .sidebar li:hover { color: #fff; }
        .main { flex: 1; padding: 40px; }
        .cards { display: flex; gap: 20px; margin-bottom: 40px; }
        .card { background: #fff; flex: 1; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .card h3 { margin: 0 0 10px; color: #6c7293; font-size: 0.9rem; text-transform: uppercase; }
        .card .value { font-size: 2rem; font-weight: bold; color: #1e1e2d; }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Dashboard</h2>
        <ul><li>Visão Geral</li><li>Vendas</li><li>Clientes</li><li>Configurações</li></ul>
    </div>
    <div class="main">
        <div class="cards">
            <div class="card"><h3>Receita Total</h3><div class="value">R$ 45.231</div></div>
            <div class="card"><h3>Novos Usuários</h3><div class="value">1,245</div></div>
            <div class="card"><h3>Conversão</h3><div class="value">3.4%</div></div>
        </div>
        <div class="card" style="height: 300px; display:flex; align-items:center; justify-content:center; color:#999;">Gráfico Principal</div>
    </div>
</body>
</html>"""
    },
    "Catalogo_9_Pricing_Comparison": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Tabela de Comparação</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 50px; background: #fff; color: #333; }
        h1 { text-align: center; margin-bottom: 50px; }
        table { width: 100%; border-collapse: collapse; max-width: 1000px; margin: 0 auto; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
        th, td { padding: 20px; text-align: center; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: bold; }
        th:first-child, td:first-child { text-align: left; font-weight: bold; }
        tr:hover { background: #fdfdfd; }
        .check { color: #2ecc71; font-weight: bold; }
        .cross { color: #e74c3c; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Compare nossos Planos</h1>
    <table>
        <tr><th>Recursos</th><th>Free</th><th>Pro</th><th>Premium</th></tr>
        <tr><td>Limite de Produtos</td><td>50</td><td>500</td><td>Ilimitado</td></tr>
        <tr><td>Suporte</td><td>Email</td><td>Chat</td><td>24/7 Telefone</td></tr>
        <tr><td>Domínio Personalizado</td><td class="cross">X</td><td class="check">V</td><td class="check">V</td></tr>
        <tr><td>Analytics Avançado</td><td class="cross">X</td><td class="cross">X</td><td class="check">V</td></tr>
    </table>
</body>
</html>"""
    },
    "Catalogo_10_CoffeeShop_Menu": {
        "index.html": """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cafeteria Elegante</title>
    <style>
        body { font-family: 'Georgia', serif; margin: 0; background: #fdfbf7; color: #4a3f35; }
        header { text-align: center; padding: 80px 20px 40px; }
        h1 { font-size: 3rem; margin: 0; font-style: italic; }
        .menu-list { max-width: 800px; margin: 0 auto; padding: 40px; }
        .category { margin-bottom: 50px; }
        .category h2 { border-bottom: 2px solid #e0d5c1; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; font-size: 1.2rem; }
        .item { display: flex; justify-content: space-between; margin-bottom: 20px; align-items: baseline; }
        .item-name { font-weight: bold; font-size: 1.1rem; }
        .dots { flex: 1; border-bottom: 1px dotted #ccc; margin: 0 15px; }
        .item-price { font-weight: bold; color: #8b5e34; }
        .desc { font-size: 0.9rem; color: #7a6e60; margin-top: 5px; font-style: italic; }
    </style>
</head>
<body>
    <header><h1>La Café Artesanal</h1></header>
    <div class="menu-list">
        <div class="category">
            <h2>Cafés Quentes</h2>
            <div class="item"><div class="item-name">Espresso Duplo</div><div class="dots"></div><div class="item-price">R$ 8,00</div></div>
            <div class="desc">Grãos selecionados 100% arábica.</div><br>
            <div class="item"><div class="item-name">Cappuccino Italiano</div><div class="dots"></div><div class="item-price">R$ 14,00</div></div>
            <div class="desc">Espresso, leite vaporizado e crema.</div>
        </div>
        <div class="category">
            <h2>Acompanhamentos</h2>
            <div class="item"><div class="item-name">Croissant de Amêndoas</div><div class="dots"></div><div class="item-price">R$ 16,00</div></div>
            <div class="desc">Massa folhada autêntica francesa.</div>
        </div>
    </div>
</body>
</html>"""
    }
}

base_path = "/mnt/c/Users/Administrator/Documents/RockyTree/Catalogos"

for folder, files in templates.items():
    folder_path = os.path.join(base_path, folder)
    os.makedirs(folder_path, exist_ok=True)
    for filename, content in files.items():
        with open(os.path.join(folder_path, filename), "w", encoding="utf-8") as f:
            f.write(content)

print("Generated 8 frontend templates successfully.")
