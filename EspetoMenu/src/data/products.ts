import logoImg from "@/assets/logo.png";
import espetoCarne from "@/assets/espeto-carne.png";
import espetoCoracao from "@/assets/espeto-coracao.png";
import espetoMedalhao from "@/assets/espeto-medalhao.png";
import espetoToscana from "@/assets/espeto-toscana.jpg";
import espetoMisto from "@/assets/espeto-misto.jpg";
import espetoMeioAsa from "@/assets/espeto-meio-asa.jpg";
import espetoCupim from "@/assets/espeto-cupim.jpg";
import espetoCarneSol from "@/assets/espeto-carne-sol.jpg";
import pepsi1l from "@/assets/pepsi-1l.jpg";
import antartica1l from "@/assets/antartica-1l.jpg";
import cocaCola1l from "@/assets/coca-cola-1l.jpg";
import pepsiLata from "@/assets/pepsi-lata.jpg";
import anticaLata from "@/assets/antartica-lata.jpg";
import cocaColaLata from "@/assets/coca-cola-lata.jpg";
import fantaLaranjaLata from "@/assets/fanta-laranja-lata.jpg";
import amstelLata from "@/assets/amstel-lata.jpg";
import brahmaLata from "@/assets/brahma-lata.jpg";
import heinekenLn from "@/assets/heineken-ln.jpg";
import stellaLn from "@/assets/stella-ln.jpg";
import coronaLn from "@/assets/corona-ln.jpg";

export { logoImg };

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = ["Todos", "Espetos", "Refrigerantes 1L", "Refrigerantes Lata", "Cerveja Lata", "Cerveja Long Neck"];

export const products: Product[] = [
  // === ESPETOS ===
  {
    id: "esp-01",
    name: "Toscana",
    description: "Linguiça toscana grelhada na brasa — acompanha farofa e vinagrete",
    price: 6.0,
    category: "Espetos",
    image: espetoToscana,
  },
  {
    id: "esp-02",
    name: "Misto",
    description: "Toscana, carne e frango no mesmo espeto — acompanha farofa e vinagrete",
    price: 9.0,
    category: "Espetos",
    image: espetoMisto,
  },
  {
    id: "esp-03",
    name: "Meio da Asa",
    description: "Meio da asa grelhado crocante — acompanha farofa e vinagrete",
    price: 9.0,
    category: "Espetos",
    image: espetoMeioAsa,
  },
  {
    id: "esp-04",
    name: "Coração",
    description: "Coração de frango temperado com ervas e limão — acompanha farofa e vinagrete",
    price: 8.0,
    category: "Espetos",
    image: espetoCoracao,
  },
  {
    id: "esp-05",
    name: "Medalhão",
    description: "Medalhão de frango e bacon defumado — acompanha farofa e vinagrete",
    price: 10.0,
    category: "Espetos",
    image: espetoMedalhao,
  },
  {
    id: "esp-06",
    name: "Carne (Contra Filé)",
    description: "Contra filé suculento grelhado na brasa — acompanha farofa e vinagrete",
    price: 12.0,
    category: "Espetos",
    image: espetoCarne,
  },
  {
    id: "esp-07",
    name: "Cupim Grill",
    description: "Cupim macio e suculento grelhado lentamente — acompanha farofa e vinagrete",
    price: 15.0,
    category: "Espetos",
    image: espetoCupim,
  },
  {
    id: "esp-08",
    name: "Carne do Sol c/ Queijo Coalho",
    description: "Carne do sol com queijo coalho grelhado — acompanha farofa e vinagrete",
    price: 13.0,
    category: "Espetos",
    image: espetoCarneSol,
  },

  // === REFRIGERANTES 1 LITRO (R$ 7,00) ===
  {
    id: "ref1l-01",
    name: "Pepsi 1L",
    description: "Pepsi gelada — 1 litro",
    price: 7.0,
    category: "Refrigerantes 1L",
    image: pepsi1l,
  },
  {
    id: "ref1l-02",
    name: "Antártica 1L",
    description: "Guaraná Antártica gelado — 1 litro",
    price: 7.0,
    category: "Refrigerantes 1L",
    image: antartica1l,
  },
  {
    id: "ref1l-03",
    name: "Coca-Cola 1L",
    description: "Coca-Cola gelada — 1 litro",
    price: 7.0,
    category: "Refrigerantes 1L",
    image: cocaCola1l,
  },

  // === REFRIGERANTES LATA (R$ 5,00) ===
  {
    id: "reflata-01",
    name: "Pepsi Lata",
    description: "Pepsi gelada — 350ml",
    price: 5.0,
    category: "Refrigerantes Lata",
    image: pepsiLata,
  },
  {
    id: "reflata-02",
    name: "Antártica Lata",
    description: "Guaraná Antártica gelado — 350ml",
    price: 5.0,
    category: "Refrigerantes Lata",
    image: anticaLata,
  },
  {
    id: "reflata-03",
    name: "Coca-Cola Lata",
    description: "Coca-Cola gelada — 350ml",
    price: 5.0,
    category: "Refrigerantes Lata",
    image: cocaColaLata,
  },
  {
    id: "reflata-04",
    name: "Fanta Laranja Lata",
    description: "Fanta Laranja gelada — 350ml",
    price: 5.0,
    category: "Refrigerantes Lata",
    image: fantaLaranjaLata,
  },

  // === CERVEJA LATA (R$ 6,00) ===
  {
    id: "cervlata-01",
    name: "Amstel Lata",
    description: "Amstel gelada — 350ml",
    price: 6.0,
    category: "Cerveja Lata",
    image: amstelLata,
  },
  {
    id: "cervlata-02",
    name: "Brahma Lata",
    description: "Brahma gelada — 350ml",
    price: 6.0,
    category: "Cerveja Lata",
    image: brahmaLata,
  },

  // === CERVEJA LONG NECK (R$ 9,00) ===
  {
    id: "cervln-01",
    name: "Heineken Long Neck",
    description: "Heineken premium gelada — 355ml",
    price: 9.0,
    category: "Cerveja Long Neck",
    image: heinekenLn,
  },
  {
    id: "cervln-02",
    name: "Stella Artois Long Neck",
    description: "Stella Artois gelada — 355ml",
    price: 9.0,
    category: "Cerveja Long Neck",
    image: stellaLn,
  },
  {
    id: "cervln-03",
    name: "Corona Long Neck",
    description: "Corona Extra gelada — 355ml",
    price: 9.0,
    category: "Cerveja Long Neck",
    image: coronaLn,
  },
];
