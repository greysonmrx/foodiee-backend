interface IFindAllUsersByTenantDTO {
  except_user_id: string;
  relations?: Array<string>;
  tenant_id: string;
}

export default IFindAllUsersByTenantDTO;
