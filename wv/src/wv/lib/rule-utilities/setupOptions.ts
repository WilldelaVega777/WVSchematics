//----------------------------------------------------------------------------------------
// Imports Section (Schematic Libraries)
//----------------------------------------------------------------------------------------
import { Tree }                 from '@angular-devkit/schematics';
import { join }                 from 'path';
import { normalize }            from 'path';
import { getWorkspace }         from '../utility/config';


//----------------------------------------------------------------------------------------
// Imports Section (Local Functions)
//----------------------------------------------------------------------------------------
export function setupOptions(host: Tree, options: any): Tree 
{
    const workspace = getWorkspace(host);
    if (!options.project) 
    {
      options.project = Object.keys(workspace.projects)[0];
    }
    
    const project = workspace.projects[options.project];
  
    options.path = join(normalize(project.root), 'src');
    
    return host;
}