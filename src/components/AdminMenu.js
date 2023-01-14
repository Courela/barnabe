import Menu, { SubMenu, Item as MenuItem } from 'rc-menu/lib';
import { menuGroupAnimation } from '../utils/animations';

export default function AdminMenu(props) {
    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={menuGroupAnimation}>
            {/* <MenuItem key={"/admin/drive"}>Google Drive</MenuItem> */}
            <SubMenu title="Utilizadores">
                <MenuItem key={"/admin/users/add"}>Criar</MenuItem>
                <MenuItem key={"/admin/users"}>Listar</MenuItem>
            </SubMenu>
            <MenuItem key={"/admin/seasons"}>Épocas</MenuItem>
            <SubMenu title="Colectividades">
                <MenuItem key={"/admin/teams/add"}>Criar</MenuItem>
                <MenuItem key={"/admin/teams"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Escalões">
                <MenuItem key={"/admin/steps/manage"}>Gerir</MenuItem>
            </SubMenu>
            <SubMenu title="Jogadores">
                <MenuItem key={"/admin/players/add"}>Inscrever</MenuItem>
                <MenuItem key={"/admin/players/search"}>Procurar</MenuItem>
            </SubMenu>
            <SubMenu title="Equipas">
                <MenuItem key={"/admin/teamsteps/listing"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Jogos">
                <MenuItem key={"/admin/matches/add"}>Adicionar</MenuItem>
                <MenuItem key={"/admin/matches/list"}>Listar</MenuItem>
            </SubMenu>
            <SubMenu title="Fichas de Jogo">
                <MenuItem key={"/admin/templates/match-sheet"}>Jogo</MenuItem>
                <MenuItem key={"/admin/templates/team-sheet"}>Equipa</MenuItem>
            </SubMenu>
            <SubMenu title="Utilitários">
                <MenuItem key={"/admin"}>Estatísticas</MenuItem>
                <MenuItem key={"/admin/db"}>Base de Dados</MenuItem>
                <MenuItem key={"/admin/manage-persons"}>Gerir Pessoas</MenuItem>
            </SubMenu>
        </Menu>);
}
