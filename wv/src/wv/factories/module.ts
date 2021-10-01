//----------------------------------------------------------------------------------------
// Imports Section (Schematic Libraries)
//----------------------------------------------------------------------------------------
import { strings }                              from '@angular-devkit/core';
import { Path }                                 from '@angular-devkit/core';

import { apply }                                from '@angular-devkit/schematics';
import { move }                                 from '@angular-devkit/schematics';
import { Rule }                                 from '@angular-devkit/schematics';
import { Tree }                                 from '@angular-devkit/schematics';
import { applyTemplates }                       from '@angular-devkit/schematics';
import { mergeWith }                            from '@angular-devkit/schematics';
import { url }                                  from '@angular-devkit/schematics';
import { chain }                                from '@angular-devkit/schematics';
import { noop }                                 from '@angular-devkit/schematics';
import { filter }                               from '@angular-devkit/schematics';
import { schematic }                            from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (Utility Functions)
//----------------------------------------------------------------------------------------
import { createDefaultPath }                    from '../lib/utility/workspace';
import { parseName }                            from '../lib/utility/parse-name';
import { findModuleFromOptions }                from '../lib/utility/find-module';

//----------------------------------------------------------------------------------------
// Imports Section (Higher Order Functions)
//----------------------------------------------------------------------------------------
import { addRouteDeclarationToNgModule }        from '../lib/rule-utilities/addRouteDeclarationToNgModule';
import { addModuleDeclarationToNgModule}        from '../lib/rule-utilities/addModuleDeclarationToNgModule';
import { getRoutingModulePath }                 from '../lib/rule-utilities/getRoutingModulePath';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ModuleSchema }                         from '../typings/wv/schemas/module-schema';
import { RoutingScope }                         from '../typings/wv/schemas/module-schema';

//----------------------------------------------------------------------------------------
// Rules Section (Rule for New Projects)
//----------------------------------------------------------------------------------------
export function newModule(options: ModuleSchema) : Rule
{
    return async (host: Tree) => 
    {
        if (options.path === undefined) 
        {
            options.path = await createDefaultPath(host, options.project as string);
        }
    
        if (options.module) 
        {
            options.module = findModuleFromOptions(host, options);
        }
    
        let routingModulePath: Path | undefined;

        const isLazyLoadedModuleGen = !!(options.route && options.module);

        if (isLazyLoadedModuleGen) 
        {
            options.routingScope = RoutingScope.Child;
            routingModulePath = getRoutingModulePath(host, options.module as string);
        }
    
        const parsedPath = parseName(options.path, options.name);

        options.name = parsedPath.name;
        options.path = parsedPath.path;
    
        const templateSource = apply(
            url('../files/module'), 
            [
                options.routing || (isLazyLoadedModuleGen && routingModulePath)
                ? noop()
                : filter(path => !path.endsWith('-routing.module.ts.template')),
                applyTemplates({
                ...strings,
                lazyRoute: isLazyLoadedModuleGen,
                lazyRouteWithoutRouteModule: isLazyLoadedModuleGen && !routingModulePath,
                lazyRouteWithRouteModule: isLazyLoadedModuleGen && !!routingModulePath,
                ...options,
                }),
                move(parsedPath.path),
            ]
        );
        
        const moduleDasherized = strings.dasherize(options.name);
        
        const modulePath = `${''}${moduleDasherized}.module.ts`;
    
        return chain([
            !isLazyLoadedModuleGen ? addModuleDeclarationToNgModule(options) : noop(),
            addRouteDeclarationToNgModule(options, routingModulePath),
            mergeWith(templateSource),
            isLazyLoadedModuleGen
            ? schematic('component', {
                ...options,
                module: modulePath,
                })
            : noop()
        ]);
    };
}