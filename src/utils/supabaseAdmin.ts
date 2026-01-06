import { supabase } from './supabase';
import type { ProductCategoryRow, ProductRequirementRow } from './supabase';

// Static data import (temporary for data migration)
import {
  placeholderRequirements,
  plumbingRequirement,
  ceilingRequirement,
  steelRequirement,
  concreteMortarRequirement,
  doorsWindowsRequirement,
  roadConstructionRequirement,
  flooringRequirement,
  structuralTimberRequirement,
  woodPanelsRequirement,
  thermalInsulationRequirement,
  membranesRequirement,
  precastConcreteRequirement,
  masonryRequirement,
  glassRequirement,
  gypsumRequirement,
  getProductCategories
} from './productData';

// Function to create database schema
export const createDatabaseSchema = async () => {
  try {
    // Create product_requirements table
    const { error: requirementsError } = await supabase.rpc('create_product_requirements_table');
    if (requirementsError) throw requirementsError;
    
    // Create product_categories table
    const { error: categoriesError } = await supabase.rpc('create_product_categories_table');
    if (categoriesError) throw categoriesError;
    
    return { success: true, message: 'Database schema created successfully' };
  } catch (error) {
    console.error('Error creating database schema:', error);
    return { success: false, message: `Error creating database schema: ${error.message}` };
  }
};

// Function to import all static data to Supabase
export const importAllData = async () => {
  try {
    // Map of requirement objects to import
    const requirementsToImport: Record<string, any> = {
      'placeholder-req': placeholderRequirements,
      'plumbing-req': plumbingRequirement,
      'ceiling-req': ceilingRequirement,
      'steel-req': steelRequirement,
      'concrete-mortar-req': concreteMortarRequirement,
      'doors-windows-req': doorsWindowsRequirement,
      'road-construction-req': roadConstructionRequirement,
      'flooring-req': flooringRequirement,
      'structural-timber-req': structuralTimberRequirement,
      'wood-panels-req': woodPanelsRequirement,
      'thermal-insulation-req': thermalInsulationRequirement,
      'membranes-req': membranesRequirement,
      'precast-concrete-req': precastConcreteRequirement,
      'masonry-req': masonryRequirement,
      'glass-req': glassRequirement,
      'gypsum-req': gypsumRequirement
    };

    // First import all requirements
    for (const [id, req] of Object.entries(requirementsToImport)) {
      // Convert to snake_case fields for the database
      const requirementRow: ProductRequirementRow = {
        id,
        title: req.title,
        description: req.description,
        mandatory_tests: req.mandatoryTests,
        documentation_required: req.documentationRequired,
        cpr_changes: req.cprChanges,
        certification_systems: req.certificationSystems
      };

      const { error } = await supabase
        .from('product_requirements')
        .upsert(requirementRow);
      
      if (error) throw error;
    }

    // Then import all product categories
    const categories = getProductCategories();
    
    for (const category of categories) {
      // Convert to snake_case fields for the database
      const categoryRow: ProductCategoryRow = {
        id: category.id,
        name: category.name,
        code: category.code,
        description: category.description,
        requirement_id: category.requirements.id
      };

      const { error } = await supabase
        .from('product_categories')
        .upsert(categoryRow);
      
      if (error) throw error;
    }

    return { success: true, message: 'Data imported successfully' };
  } catch (error) {  
    console.error('Error importing data:', error);
    return { success: false, message: `Error importing data: ${error.message}` };
  }
};
