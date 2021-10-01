//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { Path }                         from '@angular-devkit/core';
import { normalize }                    from '@angular-devkit/core';
import { Tree }                         from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (Schematic Utilities)
//----------------------------------------------------------------------------------------
import { MODULE_EXT }                   from '../utility/find-module';
import { ROUTING_MODULE_EXT }           from '../utility/find-module';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function getRoutingModulePath(host: Tree, modulePath: string) : Path | undefined 
{
    const routingModulePath = modulePath.endsWith(ROUTING_MODULE_EXT)
      ? modulePath
      : modulePath.replace(MODULE_EXT, ROUTING_MODULE_EXT);
  
    return host.exists(routingModulePath) ? normalize(routingModulePath) : undefined;
}