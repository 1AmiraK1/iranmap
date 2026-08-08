<form name="search-form" id="search-form">
    <div class="row mb-3">
        <div class="col form-floating">
            <input type="text" class="form-control" id="title-search" name="title-search" placeholder="عنوان و نام مرکز"
                autocomplete="organization-title">
            <label for="title-search">اسم مرکز</label>
        </div>
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="type-search" id="type-search">
                <option selected value="">همه</option>
                @isset($types)
                    @foreach ($types as $type)
                        <option value="{{ $type->id }}">{{ $type->type_title }}</option>
                    @endforeach
                @endisset
            </select>
            <label for="type-search">نوع</label>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="province-search" id="province-search">
                <option selected value="">همه</option>
                @isset($provinces)
                    @foreach ($provinces as $province)
                        <option value="IR-{{ sprintf('%02d', $province->id) }}">{{ $province->name }}</option>
                    @endforeach
                @endisset
            </select>
            <label for="province-search">استان</label>
        </div>
        <div class="col form-floating">
            <select class="form-select" aria-label="Default select example" name="county-search" id="county-search">
                <option selected value="">همه</option>
                @isset($counties)
                    @foreach ($counties as $county)
                        <option value="{{ $county->id }}">{{ $county->name }}</option>
                    @endforeach
                @endisset
            </select>
            <label for="county-search">شهر</label>
        </div>
    </div>
    <button type="submit" id="search-submit" class="btn btn-primary container">جستجو</button>
</form>
