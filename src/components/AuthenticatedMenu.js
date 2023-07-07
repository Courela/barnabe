import Menu, { SubMenu, Item as MenuItem } from 'rc-menu/lib';
import { menuGroupAnimation } from '../utils/animations';

export default function AuthenticatedMenu(props) {
    const stepOptions = [
        // <MenuItem key={"/seasons/" + props.season + "/add-step"}>Inscrever escalão</MenuItem>,
        // <MenuItem key={"/seasons/" + props.season + "/remove-step"}>Remover escalão</MenuItem>
    ];
    var stepsMenu = (season, steps) => {
        let menuItems = [];
        if (steps && Array.isArray(steps)) {
            steps.forEach(el => {
                menuItems.push(
                    <MenuItem key={"/seasons/" + season + "/steps/" + el.id} 
                        stepId={el.id}
                        stepName={el.description}>{el.description}
                    </MenuItem>);
            });
        }

        if (menuItems.length > 0) {
            return (<SubMenu title={<span>Escalões</span>} key="1">
                {menuItems}
            </SubMenu>);
        }
        else return "";
    }
    
    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={menuGroupAnimation}>
            {props.isSeasonActive ?
                stepOptions
                : ''}
            {stepsMenu(props.season, props.steps)}
            <MenuItem key={"/seasons/" + props.season + "/documents"}>Documentos</MenuItem>
        </Menu>);
}
