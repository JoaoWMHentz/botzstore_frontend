import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ProductService, Product, Category } from '../services/ProductService';
import { Margin } from '@mui/icons-material';

export default function ProductCreatePage() {
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: { id: 0, name: '' },
    thumbnail: '',
    photos: [],
    showOnHomepage: false,
    detailedDescription: '',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (field: keyof Product, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await ProductService.create(product);
      alert('Produto cadastrado com sucesso!');
      setProduct({
        id: '',
        name: '',
        description: '',
        price: 0,
        category: { id: 0, name: '' },
        thumbnail: '',
        photos: [],
        showOnHomepage: false,
        detailedDescription: '',
      });
      fetchProducts(); // Atualiza a tabela após o cadastro
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar o produto.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAll();
      setProducts(response);
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar os produtos.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProductService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar as categorias.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  var filteredProducts = null
  if(products.length > 0){
     filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  }

  const handleRowClick = (product: Product) => {
    setProduct(product);
  };

  const handleImageUpload = (field: keyof Product, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        handleChange(field, reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImageUpload = (files: FileList) => {
    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Images) => {
      handleChange('photos', base64Images);
    });
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ marginBottom: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Cadastro de Produto
      </Typography>
      <Paper sx={{ padding: 4, marginBottom: 4 }}>
        <Grid container spacing={4}>
          {/* Informações Básicas */}
          <Grid size={12} item xs={12} {...({} as any)}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Informações Básicas
            </Typography>
          </Grid>
          <Grid item size={2} md={5} {...({} as any)}>
            <TextField
              fullWidth
              label="ID do Produto"
              value={product.id || ''}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
            />
          </Grid>
          <Grid item size={2} md={5} {...({} as any)}>
            <TextField
              fullWidth
              label="Nome do Produto"
              value={product.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item size={4} {...({} as any)}>
            <TextField
              fullWidth
              label="Descrição"
              value={product.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>
          <Grid item size={2} md={5} {...({} as any)}>
            <TextField
              fullWidth
              label="Preço"
              type="number"
              value={product.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item size={2} md={5} {...({} as any)}>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => <TextField {...params} label="Categoria" />}
              onChange={(event, value) => handleChange('category', { id: value?.id, name: value?.name })}
              value={categories.find((cat) => cat.id === product.category.id) || null}
            />
          </Grid>

          {/* Imagens */}
          <Grid size={12} item xs={12} {...({} as any)}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Imagens
            </Typography>
          </Grid>
          <Grid item size={2} md={6} {...({} as any)}>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              Thumbnail
            </Typography>
            <div>
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt="Thumbnail"
                  style={{ width: '100%', maxWidth: '150px', height: 'auto', objectFit: 'cover', marginBottom: '10px' }}
                />
              )}
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleImageUpload('thumbnail', e.target.files[0])}
              />
            
            </Box>
          </Grid>
          <Grid item size={10} md={6} {...({} as any)}>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              Fotos Adicionais
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 2 }}>
              {product.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  style={{ width: '100%', maxWidth: '150px', height: 'auto', objectFit: 'cover' }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
              <input
                id="photos-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleMultipleImageUpload(e.target.files)}
              />
            
            </Box>
          </Grid>
          <Grid item size={12} md={6} {...({} as any)}>
              <Button
                sx={{ color: 'white' }}
                variant="contained"
                color="primary"
                component="label"
                htmlFor="thumbnail-upload"
              >
                Upload Thumbnail
              </Button>
                <Button
                sx={{ color: 'white', marginLeft: 4 }}
                variant="contained"
                color="primary"
                component="label"
                htmlFor="photos-upload"
              >
                Upload Fotos Adicionais
              </Button>
          </Grid>
          <Grid size={12} item xs={12} {...({} as any)}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Configurações
            </Typography>
          </Grid>
          <Grid item  size={12} {...({} as any)}>
            <FormControlLabel
              control={
                <Switch
                  checked={product.showOnHomepage}
                  onChange={(e) => handleChange('showOnHomepage', e.target.checked)}
                />
              }
              label="Exibir na Página Inicial"
            />
          </Grid>
          <Grid item size={12} {...({} as any)}>
            <TextField
              fullWidth
              label="Descrição Detalhada (HTML)"
              multiline
              rows={4}
              value={product.detailedDescription}
              onChange={(e) => handleChange('detailedDescription', e.target.value)}
            />
          </Grid>

          {/* Botão de Ação */}
          <Grid size={12} item xs={12} sx={{ textAlign: 'right' }} {...({} as any)}>
            <Button  sx={{ color: 'white' }} variant="contained" color="primary" onClick={handleSubmit}>
              {product.id ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Produtos */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Produtos Cadastrados
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Pesquisar Produto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button   sx={{ color: 'white' }} variant="contained" color="primary" onClick={fetchProducts}>
          Atualizar
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Exibir na Página Inicial</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts?.map((product: any) => (
              <TableRow key={product.id} onClick={() => handleRowClick(product)} style={{ cursor: 'pointer' }}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.showOnHomepage ? 'Sim' : 'Não'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}