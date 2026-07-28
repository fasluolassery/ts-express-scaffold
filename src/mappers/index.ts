/**
 * Base Mapper interface contract for model-to-DTO transformation.
 */
export interface IMapper<DomainModel, Dto> {
  toDto(entity: DomainModel): Dto;
  toDtoList?(entities: DomainModel[]): Dto[];
}
