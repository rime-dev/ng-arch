import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '@rng/data-access/base';
import {EntityState} from '@rng/data-access/base/models/base.model';
import {dataFilter} from '@rng/data-access/base/operators';
import {MapComponent} from 'apps/demos/services-app/src/app/components/map/map.component';
import {Project} from 'apps/demos/services-app/src/app/models/project.model';
import {Feature} from 'ol';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Component({
  selector: 'rng-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  public tabSelected = 0;
  public filterByTypeSelected = 'all';
  public points$: Observable<any[]> = of([]);
  public mapIsOpenOnMobile = false;

  public activeProjects$: Observable<EntityState<Project>[]>;

  public otherProjects$: Observable<EntityState<Project>[]>;

  public inactiveProjects$: Observable<EntityState<Project>[]>;

  public finishedProjects$: Observable<EntityState<Project>[]>;

  constructor(private router: Router, private dataService: DataService) {
    this.activeProjects$ = of([]);
    this.otherProjects$ = of([]);
    this.inactiveProjects$ = of([]);
    this.finishedProjects$ = of([]);
    const currentNavigation = this.router.getCurrentNavigation();
    const state = currentNavigation?.extras.state;
    if (state) {
      if (state[0] === 'state' && state[1] === 'active') {
        this.tabSelected = 0;
      }
      if (state[0] === 'group' && state[1] === undefined) {
        this.tabSelected = 1;
      }
      if (state[0] === 'state' && state[1] === 'inactive') {
        this.tabSelected = 2;
      }
      if (state[0] === 'state' && state[1] === 'finished') {
        this.tabSelected = 3;
      }
    }
  }

  toogleMapOnMobile() {
    this.mapIsOpenOnMobile = !this.mapIsOpenOnMobile;
  }
  updateMap(map: MapComponent): void {
    setTimeout(() => {
      map.updateMap();
    }, 0);
  }
  changeTab(event: number): void {
    this.tabSelected = event;
  }
  loadDataPoints(projects: EntityState<Project>[]) {
    if (projects) {
      this.points$ = of([
        ...projects.map(
          (project: EntityState<Project>) =>
            new Feature({
              geometry: new Point(fromLonLat(project.data.location.coordinates)),
              data: project.data,
            })
        ),
      ]);
    }
  }
  filterByType(type?: string): void {
    if (!type) {
      this.activeProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'active'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.otherProjects$ = this.dataService
        .select('Project')
        .entities$.pipe(
          dataFilter({fieldPath: 'group', opStr: '==', value: undefined}),
          delay(0),
          tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
        );

      this.inactiveProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'inactive'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.finishedProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'finished'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.filterByTypeSelected = 'all';
    } else {
      this.activeProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'active'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
          {fieldPath: 'type', opStr: '==', value: type},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.otherProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'group', opStr: '==', value: undefined},
          {fieldPath: 'type', opStr: '==', value: type},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.inactiveProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'inactive'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
          {fieldPath: 'type', opStr: '==', value: type},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );

      this.finishedProjects$ = this.dataService.select('Project').entities$.pipe(
        dataFilter([
          {fieldPath: 'state', opStr: '==', value: 'finished'},
          {fieldPath: 'group', opStr: '==', value: 'GS1'},
          {fieldPath: 'type', opStr: '==', value: type},
        ]),
        delay(0),
        tap({next: (documents: EntityState<Project>[]) => this.loadDataPoints(documents)})
      );
      this.filterByTypeSelected = type;
    }
  }
  ngOnInit(): void {
    this.filterByType();
  }
}
